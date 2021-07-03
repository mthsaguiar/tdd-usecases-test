import { SavePurchases } from "@/domain/usecases";
import { CacheStore } from "@/data/protocols/cache";

export  class CacheStoreSpy implements CacheStore {
    actions: Array<CacheStoreSpy.Action> = []
    deleteKey: string | undefined
    insertKey: string | undefined
    insertValues: Array<SavePurchases.Params> = [];

    delete(deleteKey: string): void{
        this.actions.push(CacheStoreSpy.Action.delete)
        this.deleteKey = deleteKey;
    }
    insert(key: string, value: any): void {
        this.actions.push(CacheStoreSpy.Action.insert)
        this.insertKey = key
        this.insertValues = value;
    }
    replace(key: string, value: any): void {
        this.delete(key)
        this.insert(key, value)
    }
    siulateDeleteError(): void{
        jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(()=>{
            this.actions.push(CacheStoreSpy.Action.delete)
            throw new Error()
        });
    }
    siulateInsertError(): void{
        jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(()=>{
            this.actions.push(CacheStoreSpy.Action.insert)
            throw new Error()
        });
    }
}

export namespace CacheStoreSpy {
    export enum Action {
        delete,
        insert
    }
}