import nodemailer from 'nodemailer';

class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, 
            auth: {
                user: 'javatok121@gmail.com',
                pass: 'ulbfkfxedyvjiwpk'
            }
        });
    }

    public async sendMail(to: string, subject: string, text: string) {
        try {
            await this.transporter.sendMail({
                from: '"Blog" <javatok121@gmail.com>',
                to: to,
                subject: subject, 
                text: text, 
            });
            console.log(`Email sent to ${to}`);
        } catch (error) {
            console.error('Error occurred while sending email:', error);
            throw new Error('Error occurred while sending email');
        }
    }
}

export default MailService;
