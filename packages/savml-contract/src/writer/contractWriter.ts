import { ContractContext, Writer } from "../contract/contract";

interface WriterContext {
  writer: Writer,
  options: object
}

export class ContractWriter {
    private writers: WriterContext[] = []
    constructor () {
  
    }
    addWriter(writer: Writer, options?: object) {
        this.writers.push({writer, options: options || {}})
    }
    async flush(ctx: ContractContext) : Promise<any[]> {
        return Promise.all(this.writers.map(it => it.writer(ctx, it.options)))
    }
}
