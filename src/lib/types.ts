export interface ClientResume {
  link: string;
}

export interface ReviewStats {
  resumeId: number;
  _avg: {
    structure: number;
    clarity: number;
    formatting: number;
    relevance: number;
    wording: number;
  };
  _count: {
    id: number;
  };
  comments: string[];
  resumeLink: string;
  reviewCount: number;
  self: boolean;
}
