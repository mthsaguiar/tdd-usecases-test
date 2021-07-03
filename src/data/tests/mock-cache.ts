import { SavePurchases } from "@/domain/usecases";
import { CacheStore } from "@/data/protocols/cache";

export  class CacheStoreSpy implements CacheStore {
    deleteKey: string | undefined
    insertKey: string | undefined
    deleteCallsCount = 0;
    insertCallsCount = 0;
    insertValues: Array<SavePurchases.Params> = [];

    delete(deleteKey: string): void{
        this.deleteCallsCount++;
        this.deleteKey = deleteKey;
    }
    insert(key: string, value: any): void {
        this.insertCallsCount++;
        this.insertKey = key
        this.insertValues = value;
    }
    siulateDeleteError(): void{
        jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(()=>{throw new Error()});
    }
    siulateInsertError(): void{
        jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(()=>{throw new Error()});
    }
}