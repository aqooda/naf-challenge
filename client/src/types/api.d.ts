export type CreateRequestResponse = Record<'id' | 'token', string>;

export interface CreateRequestData {
  requesterEmail: string;
  approverEmail: string;
  subject: string;
  pdf: string;
  highlights: Omit<Highlight, 'id' | 'status'>[];
}

export interface GetRequestResponse extends Omit<CreateRequestData, 'pdf' | 'highlights'> {
  id: string;
  pdfPath: string;
  highlights: (Omit<Highlight, 'content' | 'position'> & Record<'details', string>)[];
  requestedAt: string;
  reviewedAt: string | null;
  deletedAt: string | null;
}

export interface UpdateRequestData {
  highlights: Pick<Highlight, 'id' | 'status'>[];
}

export interface Highlight {
  id: string;
  type: 'TEXT' | 'AREA';
  content: string;
  position: string;
  status: 'APPROVED' | 'REJECTED' | null;
}
