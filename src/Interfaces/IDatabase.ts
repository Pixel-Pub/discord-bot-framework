export default interface IDatabase {
    type       : string,
    connection : any,
    models     : Array<any>
}