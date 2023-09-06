import axios, { AxiosResponse } from "axios";
import { Config, DeleteSeats, DeleteSeatsWithEmployeeId, Feedback, FeedbackOnly, RatingsWithAverageRating, ReserveSeats, ReservedSeat, UpdateEmployee } from "./types";

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
  async getReservedSeats(): Promise<ReservedSeat[]> {
    return this.sendRequest<ReservedSeat[]>("get", "/internal/seating");
  }

  async reserveSeats(reserveData: ReserveSeats): Promise<void> {
    return this.sendRequest<void>("post", "/internal/seating", reserveData);
  }

  async deleteReservedSeats(deleteData: DeleteSeatsWithEmployeeId): Promise<void> {
    return this.sendRequest<void>("delete", "/internal/seating", deleteData);
  }

  async updateEmployee(employeeData: UpdateEmployee): Promise<void> {
    return this.sendRequest<void>("put", "/internal/employee", employeeData);
  }

  async addFeedback(feedbackData: Feedback): Promise<void> {
    return this.sendRequest<void>("post", "/internal/feedback", feedbackData);
  }

  async getLayoutConfig(): Promise<Config> {
    return this.sendRequest<Config>("get", "/internal/config");
  }

  async deleteSeats(deleteData: DeleteSeats): Promise<void> {
    return this.sendRequest<void>("delete", "/admin/seating", deleteData);
  }

  async updateConfig(configData: Config): Promise<void> {
    return this.sendRequest<void>("post", "/admin/config", configData);
  }

  async getFeedbackOnly(feedbackIds: number[]): Promise<FeedbackOnly> {
    return this.sendRequest<FeedbackOnly>("post", "/admin/feedback", { feedbackIds });
  }

  async getRatingsAndAverageRating(): Promise<RatingsWithAverageRating> {
    return this.sendRequest<RatingsWithAverageRating>("get", "/admin/feedback/ratings");
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
}

export default Database;