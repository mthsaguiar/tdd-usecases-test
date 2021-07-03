import { SavePurchases } from "@/domain/usecases";
import { CacheStore } from "@/data/protocols/cache";

export  class CacheStoreSpy implements CacheStore {
    messages: Array<CacheStoreSpy.Message> = []
    deleteKey: string | undefined
    insertKey: string | undefined
    insertValues: Array<SavePurchases.Params> = [];

    delete(deleteKey: string): void{
        this.messages.push(CacheStoreSpy.Message.delete)
        this.deleteKey = deleteKey;
    }
    insert(key: string, value: any): void {
        this.messages.push(CacheStoreSpy.Message.insert)
        this.insertKey = key
        this.insertValues = value;
    }
    siulateDeleteError(): void{
        jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(()=>{
            this.messages.push(CacheStoreSpy.Message.delete)
            throw new Error()
        });
    }
    siulateInsertError(): void{
        jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(()=>{
            this.messages.push(CacheStoreSpy.Message.insert)
            throw new Error()
        });
    }
}

export namespace CacheStoreSpy {
    export enum Message {
        delete,
        insert
    }
}