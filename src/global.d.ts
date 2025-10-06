export {};

declare global {
    interface Window {
        txnmAPI: {
            LoadTemplate: (path: string) => Promise<string | undefined>,
        }
    }
}