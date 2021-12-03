import { ConfigService } from '@nestjs/config';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, createHash } from 'crypto';
import { existsSync } from 'fs';
import fs from 'fs/promises';
import nodemailer from 'nodemailer';
import { EntityManager, Repository, Transaction, TransactionManager } from 'typeorm';
import { getErrorResponse } from 'src/exceptions';
import { Request, RequestHighlight } from './entites';
import type { MailOptions } from 'nodemailer/lib/sendmail-transport';

interface RequestData extends Pick<Request, 'approverEmail' | 'subject'> {
  pdf: string;
  highlights: (Pick<RequestHighlight, 'type'> & Record<'content' | 'position', string>)[];
}

@Injectable()
export class RequestsService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
  ) {}

  async createRequest({ pdf, highlights, ...requestData }: RequestData) {
    const pdfName = `pdf/${randomBytes(8).toString('hex')}.pdf`;
    const entity = this.requestRepository.create({
      ...requestData,
      pdfPath: pdfName,
      highlights: highlights.map(({ type, ...details }) => ({ type, details: JSON.stringify(details) })),
    });
    const requestRecord = await this.requestRepository.save(entity);

    if (!existsSync('pdf')) {
      await fs.mkdir('pdf');
    }

    await fs.writeFile(pdfName, pdf.replace(/^data:application\/pdf;base64,/, ''), 'base64');
    await this.notifyApprover(requestRecord);

    return { id: requestRecord.id, token: this.generateToken(requestRecord.requesterEmail) };
  }

  generateToken(email: string) {
    return createHash('sha256').update(email).digest().toString('hex');
  }

  async getRequest(id: string, { token, email }: Record<'token' | 'email', string>) {
    const request = await this.requestRepository.findOne(id, { relations: ['highlights'] });

    if (this.generateToken(email) !== token) {
      throw new UnauthorizedException(getErrorResponse('INVALID_TOKEN'));
    }
    if (!request) {
      throw new NotFoundException(getErrorResponse('REQUEST_NOT_FOUND'));
    }

    return request;
  }

  getRequestLink(id: string, token: string) {
    return `${this.configService.get('FRONTEND_URL')}/requests/${id}?token=${token}`;
  }

  async getRequestPdf(filename: string) {
    try {
      const file = await fs.readFile(`pdf/${filename}`);

      return file;
    } catch (err) {
      throw new NotFoundException(getErrorResponse('PDF_NOT_FOUND'));
    }
  }

  async notifyApprover({ id, approverEmail, subject }: Request) {
    const link = this.getRequestLink(id, this.generateToken(approverEmail));

    await this.notifyByEmail({
      to: approverEmail,
      subject: `New request pending review (Request ID: ${id})`,
      html: `
        <p>A new request is created, please review as soon as possible.</p>
        <p>${subject}</p>
        <a href="${link}" target="_blank">${link}</a>
      `,
    });
  }

  async notifyByEmail(options: MailOptions) {
    const transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: Number(this.configService.get('SMTP_PORT')),
      auth: {
        user: this.configService.get('SMTP_USERNAME'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
      secure: true,
    });

    await transporter.sendMail({ from: this.configService.get('EMAIL_SENDER'), ...options });
  }

  async notifyRequester({ id, requesterEmail }: Request) {
    const link = this.getRequestLink(id, this.generateToken(requesterEmail));

    await this.notifyByEmail({
      to: requesterEmail,
      subject: `Your request has been reviewed (Request ID: ${id})`,
      html: `
        <p>Your request has been reviewed, please check the details by below link.</p>
        <a href="${link}" target="_blank">${link}</a>
      `,
    });
  }

  @Transaction()
  async updateRequest(
    id: string,
    highlights: Pick<RequestHighlight, 'id' | 'status'>[],
    @TransactionManager()
    entityManager?: EntityManager,
  ) {
    const reviewedAt = new Date();

    await entityManager.update(Request, id, { reviewedAt });
    await Promise.all(
      highlights.map((highlight) =>
        entityManager.update(RequestHighlight, highlight.id, { status: highlight.status, reviewedAt }),
      ),
    );

    const updatedRequest = await entityManager.findOne(Request, id);

    await this.notifyRequester(updatedRequest);

    return { id, token: this.generateToken(updatedRequest.approverEmail) };
  }
}
