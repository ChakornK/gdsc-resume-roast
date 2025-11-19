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

export interface AggregatedReview {
  resumeId: string;
  _avg: {
    structure: number | null;
    clarity: number | null;
    formatting: number | null;
    relevance: number | null;
    wording: number | null;
  };
  _count: {
    id: number;
  };
}
