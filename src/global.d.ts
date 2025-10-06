export {};

declare global {
    interface Window {
        txnmAPI: {
            LoadTemplate: (path: string) => Promise<string | undefined>,
            repositories: {
                dictionary: {
                    Create: (data: { name: string; description: string }) => Promise<boolean>
                }
            }
        }
    }
}