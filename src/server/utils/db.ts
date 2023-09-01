import axios, { AxiosResponse } from "axios";

class Database {
  private readonly databaseUrl: string;
  private readonly username: string;
  private readonly password: string;
  private readonly defaultAxiosOptions: {
    auth: {
      username: string;
      password: string;
    };
  };

  constructor(databaseUrl: string, username: string, password: string) {
    this.databaseUrl = databaseUrl;
    this.username = username;
    this.password = password;
    this.defaultAxiosOptions = {
      auth: {
        username: this.username,
        password: this.password,
      },
    };
  }

  private async sendRequest<T>(method: string, url: string, data: any = null): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios({
        method,
        url: `${this.databaseUrl}${url}`,
        ...this.defaultAxiosOptions,
        data,
      });
      return response.data;
    } catch (error) {
      console.error(`Error ${method} ${url}:`, error);
      throw error;
    }
  }

  async getReservedSeats(): Promise<any> {
    return this.sendRequest<any>("get", "/internal/seating");
  }

  async reserveSeats(reserveData: any): Promise<any> {
    return this.sendRequest<any>("post", "/internal/seating", reserveData);
  }

  async deleteReservedSeats(deleteData: any): Promise<any> {
    return this.sendRequest<any>("delete", "/internal/seating", deleteData);
  }

  async updateEmployee(employeeData: any): Promise<any> {
    return this.sendRequest<any>("put", "/internal/employee", employeeData);
  }

  async addFeedback(feedbackData: any): Promise<any> {
    return this.sendRequest<any>("post", "/internal/feedback", feedbackData);
  }

  async getLayoutConfig(): Promise<any> {
    return this.sendRequest<any>("get", "/internal/config");
  }

  async deleteSeats(deleteData: any): Promise<any> {
    return this.sendRequest<any>("delete", "/admin/seating", deleteData);
  }

  async updateConfig(configData: any): Promise<any> {
    return this.sendRequest<any>("post", "/admin/config", configData);
  }

  async getFeedbackOnly(feedbackIds: number[]): Promise<any> {
    return this.sendRequest<any>("post", "/admin/feedback", { feedbackIds });
  }

  async getRatingsAndAverageRating(): Promise<any> {
    return this.sendRequest<any>("get", "/admin/feedback/ratings");
  }
}

export default Database;
