export class MasterKey {
  #iv: Buffer;
  #key: Buffer;

  static parse(masterKey: string): MasterKey {
    const parts = masterKey.split('-');
    return new MasterKey(parts[0], parts[1]);
  }

  constructor(iv: string | Buffer, key: string | Buffer) {
    this.#iv = iv instanceof Buffer ? iv : Buffer.from(iv as string, 'hex');
    this.#key = key instanceof Buffer ? key : Buffer.from(key as string, 'hex');
  }

  get iv(): Buffer {
    return this.#iv;
  }

  get key(): Buffer {
    return this.#key;
  }

  toString(): string {
    return `${this.iv}-${this.key}`;
  }
}
