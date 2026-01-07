export class PaginationUtils {
    public static previous(currentPage: number): number {
        return currentPage > 1 ? currentPage - 1 : 1;
    }

    public static next(currentPage: number, totalPages: number): number {
        return currentPage < totalPages ? currentPage + 1 : totalPages;
    }
}