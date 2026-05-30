import { fetchEmailTemplates } from "@/actions/emailTemplatesActions";
import TemplateEditorClient from "@/components/EmailTemplates/TemplateName/TemplateEditorClient";

interface PageProps {
    params: Promise<{ templateName: string }>;
}

const TemplateEditorPage = async ({ params }: PageProps) => {
    const { templateName } = await params;
    const templates = await fetchEmailTemplates();
    const currentTemplate = templates.find((t) => t.name === templateName) ?? {
        id: "",
        name: templateName,
        category: "Auth" as const,
        channels: ["Email" as const],
        lastModified: "",
        modifiedBy: "",
        status: "Active" as const,
    };

    return (
        <TemplateEditorClient
            templateName={templateName}
            currentTemplate={currentTemplate}
        />
    );
};

export default TemplateEditorPage;
