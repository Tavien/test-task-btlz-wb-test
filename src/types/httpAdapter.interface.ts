export interface HttpAdapter {
    schedule<T>(task: () => Promise<T>, args?: T[] | undefined): Promise<T>;
}
