import { type CreateEmailResponse, Resend } from "resend";
import { env } from "~/env";

const resend = new Resend(env.RESEND_API_KEY);

type EmailTemplate =
  "demo-submission-received" |
  "demo-submission-accepted" |
  "demo-submission-rejected";

type EmailSendProps = {
  to: string,
  template: EmailTemplate,
}

type TemplateProps = {
  personName: string,
  startupName: string,
}

const getEmailContent = (template: EmailTemplate, { personName, startupName }: TemplateProps) => {
  const templates = {
    "demo-submission-received": {
      subject: "Demo Submission Received",
      html: `<p>Hi ${personName},</p><p>We've received your demo submission for ${startupName}. We'll review it and get back to you soon!</p>`
    },
    "demo-submission-accepted": {
      subject: "Demo Submission Accepted! 🎉",
      html: `<p>Hi ${personName},</p><p>Congratulations! Your demo submission for ${startupName} has been accepted!</p>`
    },
    "demo-submission-rejected": {
      subject: "Demo Submission Update",
      html: `<p>Hi ${personName},</p><p>Thank you for submitting ${startupName}. Unfortunately, we're unable to accept your demo at this time.</p>`
    }
  };
  return templates[template];
};

export const sendEmail = async (
  { to, template }: EmailSendProps,
  templateProps: TemplateProps
): Promise<CreateEmailResponse> => {
  const { subject, html } = getEmailContent(template, templateProps);
  
  return resend.emails.send({
    from: "noreply@resend.dev",
    to,
    subject,
    html,
  });
}