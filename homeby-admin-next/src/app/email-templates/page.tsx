import { fetchEmailTemplates } from "@/actions/emailTemplatesActions";
import EmailTemplatesPageClient from "@/components/EmailTemplates/EmailTemplatesPageClient";

const EmailTemplatesPage = async () => {
    const initialTemplates = await fetchEmailTemplates();

    return <EmailTemplatesPageClient initialTemplates={initialTemplates} />;
};

export default EmailTemplatesPage;
