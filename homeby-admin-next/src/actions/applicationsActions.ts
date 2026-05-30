export interface Application {
    id: number;
    name: string;
    email: string;
    agency: string;
    crm: string;
    submitted: string;
    status: "Pending" | "Approved" | "Rejected" | "Awaiting info";
    phone?: string;
}

export type DrawerTab = "Application" | "Verification" | "Notes";

// Replace with real API call when ready
export const fetchApplications = async (): Promise<Application[]> => {
    return [
        {
            id: 1,
            name: "James Wilson",
            email: "james.wilson@century21bondi.com.au",
            agency: "Century 21 Bondi",
            crm: "Box+Dice",
            submitted: "2 hours ago",
            status: "Pending",
            phone: "+61 412 308 991",
        },
        {
            id: 2,
            name: "Melissa Park",
            email: "melissa.park@ljhooker.com.au",
            agency: "LJ Hooker Chatswood",
            crm: "VaultRE",
            submitted: "5 hours ago",
            status: "Pending",
        },
        {
            id: 3,
            name: "Robert Chen",
            email: "robert.chen@raywhite.com.au",
            agency: "Ray White Newtown",
            crm: "AgentBox",
            submitted: "1 day ago",
            status: "Pending",
        },
        {
            id: 4,
            name: "Sophie Anderson",
            email: "sophie.anderson@harcourts.com.au",
            agency: "Harcourts Brisbane",
            crm: "Rex Software",
            submitted: "1 day ago",
            status: "Pending",
        },
        {
            id: 5,
            name: "David Kumar",
            email: "david.kumar@belleproperty.com.au",
            agency: "Belle Property Paddington",
            crm: "PropertyMe",
            submitted: "2 days ago",
            status: "Pending",
        },
        {
            id: 6,
            name: "Emma Thompson",
            email: "emma.t@mcgrath.com.au",
            agency: "McGrath Double Bay",
            crm: "VaultRE",
            submitted: "2 days ago",
            status: "Awaiting info",
        },
        {
            id: 7,
            name: "Michael Brown",
            email: "michael.b@stonerealestate.com.au",
            agency: "Stone Real Estate",
            crm: "Console Cloud",
            submitted: "3 days ago",
            status: "Awaiting info",
        },
        {
            id: 8,
            name: "Lisa Zhang",
            email: "lisa.zhang@jellis.com.au",
            agency: "Jellis Craig Fitzroy",
            crm: "Rex Software",
            submitted: "3 days ago",
            status: "Pending",
        },
        {
            id: 9,
            name: "Tom Harris",
            email: "tom.harris@nre.com.au",
            agency: "Nelson Alexander",
            crm: "MyDesktop",
            submitted: "5 days ago",
            status: "Approved",
        },
        {
            id: 10,
            name: "Priya Patel",
            email: "priya.patel@barryplant.com.au",
            agency: "Barry Plant",
            crm: "HomeBy Direct",
            submitted: "6 days ago",
            status: "Approved",
        },
        {
            id: 11,
            name: "Chris O'Brien",
            email: "chris.obrien@firstnational.com.au",
            agency: "First National",
            crm: "Manual / FTP Upload",
            submitted: "1 week ago",
            status: "Rejected",
        },
        {
            id: 12,
            name: "Sarah Nguyen",
            email: "sarah.nguyen@hockingstuart.com.au",
            agency: "Hocking Stuart",
            crm: "Reapit",
            submitted: "1 week ago",
            status: "Approved",
        },
    ];
};
