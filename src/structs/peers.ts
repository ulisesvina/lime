class Peer {
    id: string;
    name: string;
    address: string;
    port: number;
    signature: string;

    constructor(id: string, name: string, address: string, port: number, signature: string) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.port = port;
        this.signature = signature;
    }
}