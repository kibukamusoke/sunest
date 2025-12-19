import { RFQManagementService } from './rfq-management.service';
import { CreateRFQDto, UpdateRFQDto, RFQResponseDto, RFQListDto, RFQFilterDto, SubmitRFQDto, CreateQuoteDto, UpdateQuoteDto, QuoteResponseDto, QuoteListDto, QuoteFilterDto, AcceptQuoteDto, RejectQuoteDto, CounterOfferDto, QuoteRevisionDto, CreateRFQCommentDto, CreateQuoteCommentDto, RFQCommentListDto, QuoteCommentListDto, RFQCommentResponseDto, QuoteCommentResponseDto } from './dto';
export declare class RFQManagementController {
    private readonly rfqService;
    constructor(rfqService: RFQManagementService);
    createRFQ(createRFQDto: CreateRFQDto, req: any): Promise<RFQResponseDto>;
    listRFQs(filterDto: RFQFilterDto, req: any): Promise<RFQListDto>;
    getRFQById(rfqId: string, req: any): Promise<RFQResponseDto>;
    updateRFQ(rfqId: string, updateRFQDto: UpdateRFQDto, req: any): Promise<RFQResponseDto>;
    deleteRFQ(rfqId: string, req: any): Promise<void>;
    submitRFQ(rfqId: string, submitDto: SubmitRFQDto, req: any): Promise<RFQResponseDto>;
    getQuotesForRFQ(rfqId: string, filterDto: QuoteFilterDto, req: any): Promise<QuoteListDto>;
    createQuote(rfqId: string, createQuoteDto: CreateQuoteDto, req: any): Promise<QuoteResponseDto>;
    getQuoteById(quoteId: string, req: any): Promise<QuoteResponseDto>;
    updateQuote(quoteId: string, updateQuoteDto: UpdateQuoteDto, req: any): Promise<QuoteResponseDto>;
    submitQuote(quoteId: string, req: any): Promise<QuoteResponseDto>;
    acceptQuote(quoteId: string, acceptDto: AcceptQuoteDto, req: any): Promise<QuoteResponseDto>;
    rejectQuote(quoteId: string, rejectDto: RejectQuoteDto, req: any): Promise<QuoteResponseDto>;
    submitCounterOffer(quoteId: string, counterOfferDto: CounterOfferDto, req: any): Promise<QuoteResponseDto>;
    createQuoteRevision(quoteId: string, revisionDto: QuoteRevisionDto, req: any): Promise<QuoteResponseDto>;
    getRFQComments(rfqId: string, includeInternal: boolean | undefined, req: any): Promise<RFQCommentListDto>;
    addRFQComment(rfqId: string, commentDto: CreateRFQCommentDto, req: any): Promise<RFQCommentResponseDto>;
    getQuoteComments(quoteId: string, includeInternal: boolean | undefined, req: any): Promise<QuoteCommentListDto>;
    addQuoteComment(quoteId: string, commentDto: CreateQuoteCommentDto, req: any): Promise<QuoteCommentResponseDto>;
    getAnalyticsOverview(req: any): Promise<any>;
    getRFQServiceHealth(): Promise<any>;
}
