export class HealthDomainService {
    async health(payload: any): Promise<string> {
        return `response to: ${JSON.stringify(payload)}`;
    }
}
