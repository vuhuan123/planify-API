const brevo = require('@getbrevo/brevo')
import { env } from '~/config/environment'


let apiInstance = new brevo.TransactionalEmailsApi()

let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (email, customSubject, htmlText) => {
    try {
        let sendSmtpEmail = new brevo.SendSmtpEmail()
        sendSmtpEmail.sender = {
            email: env.ADMIN_EMAIL_ADDRESS,
            name: env.ADMIN_EMAIL_NAME
        }
        sendSmtpEmail.to = [{ email }]
        sendSmtpEmail.subject = customSubject
        sendSmtpEmail.htmlContent = htmlText

        return await apiInstance.sendTransacEmail(sendSmtpEmail)
    } catch (error) {
        console.error('Brevo sendEmail error:', error?.response?.body || error)
        throw new Error('Failed to send verification email')
    }
}


export const brevoProvider = {
    sendEmail
}
