import { Injectable } from '@nestjs/common';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

@Injectable()
export class LogsService {
  private readonly logsDir: string;

  constructor() {
    // Initialize logsDir in the constructor
    this.logsDir = path.join(process.cwd(), 'log_files');
  }

  async getLogs(): Promise<string[]> {
    try {
      const files = await fsPromises.readdir(this.logsDir);
      return files.filter((file) => file.endsWith('.log'));
    } catch (error) {
      console.error('Error reading logs directory:', error);
      throw new Error('Could not retrieve logs');
    }
  }

  async logToFile(message: string, clientIp: string): Promise<void> {
    const filePath = path.join(
      this.logsDir,
      `${new Date().toISOString().split('T')[0]}.log`,
    );
    const logEntry = `${new Date().toISOString()} - ${clientIp} - ${message}\n`;

    try {
      await fsPromises.mkdir(this.logsDir, { recursive: true });
      await fsPromises.appendFile(filePath, logEntry);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to write to log file:', errorMessage);
    }
  }
}
