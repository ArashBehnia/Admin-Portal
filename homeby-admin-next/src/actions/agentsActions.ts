export type Activity = {
    event: string;
    time: string;
};

export type Agent = {
    id: string;
    name: string;
    email: string;
    phone: string;
    agency: string;
    role: string;
    licence: string;
    licenceStatus: string;
    joined: string;
    lastLogin: string;
    status: "Active" | "Inactive" | "Pending";
    activities: Activity[];
};

export type DrawerTab = "profile" | "activity" | "actions";

// Replace with real API call when ready
export const fetchAgents = async (): Promise<Agent[]> => {
    return [
        {
            id: "1",
            name: "James Mitchell",
            email: "james@raywhitebondi.com.au",
            phone: "+61 412 887 211",
            agency: "Ray White Bondi",
            role: "Owner",
            licence: "LIC-NSW-28441",
            licenceStatus: "Verified",
            joined: "15 Dec 2024",
            lastLogin: "Today 9:14am",
            status: "Active",
            activities: [
                { event: "Logged in", time: "Today 9:14am" },
                { event: "Listing created", time: "Yesterday" },
                { event: "Review received (★★★★★)", time: "3 May 2026" },
                { event: "Password changed", time: "1 Apr 2026" },
                { event: "Account created", time: "15 Dec 2024" },
            ],
        },
        {
            id: "2",
            name: "Sarah Chen",
            email: "sarah@raywhitebondi.com.au",
            phone: "+61 412 555 123",
            agency: "Ray White Bondi",
            role: "Admin",
            licence: "LIC-NSW-29001",
            licenceStatus: "Verified",
            joined: "10 Jan 2025",
            lastLogin: "Yesterday",
            status: "Active",
            activities: [
                { event: "Logged in", time: "Yesterday" },
                { event: "Password changed", time: "15 Feb 2026" },
                { event: "Account created", time: "10 Jan 2025" },
            ],
        },
        {
            id: "3",
            name: "Michael Torres",
            email: "michael@raywhitebondi.com.au",
            phone: "+61 412 555 456",
            agency: "Ray White Bondi",
            role: "Agent",
            licence: "LIC-NSW-29881",
            licenceStatus: "Verified",
            joined: "01 Feb 2025",
            lastLogin: "2 days ago",
            status: "Active",
            activities: [
                { event: "Logged in", time: "2 days ago" },
                { event: "Listing created", time: "5 days ago" },
                { event: "Account created", time: "01 Feb 2025" },
            ],
        },
        {
            id: "4",
            name: "Emma Williams",
            email: "emma@raywhitebondi.com.au",
            phone: "+61 412 555 789",
            agency: "Ray White Bondi",
            role: "Agent",
            licence: "LIC-NSW-29992",
            licenceStatus: "Verified",
            joined: "12 Feb 2025",
            lastLogin: "3 days ago",
            status: "Active",
            activities: [
                { event: "Logged in", time: "3 days ago" },
                { event: "Account created", time: "12 Feb 2025" },
            ],
        },
        {
            id: "5",
            name: "David Park",
            email: "david@mcgrath.com.au",
            phone: "+61 415 678 912",
            agency: "McGrath Surry Hills",
            role: "Agent",
            licence: "LIC-NSW-11223",
            licenceStatus: "Verified",
            joined: "05 May 2025",
            lastLogin: "1 week ago",
            status: "Active",
            activities: [
                { event: "Logged in", time: "1 week ago" },
                { event: "Account created", time: "05 May 2025" },
            ],
        },
        {
            id: "6",
            name: "Lisa Johnson",
            email: "lisa@belleproperty.com",
            phone: "+61 416 789 012",
            agency: "Belle Property Mosman",
            role: "Agent",
            licence: "LIC-NSW-44556",
            licenceStatus: "Verified",
            joined: "20 Jun 2025",
            lastLogin: "2 weeks ago",
            status: "Inactive",
            activities: [
                { event: "Status changed to Inactive", time: "2 weeks ago" },
                { event: "Account created", time: "20 Jun 2025" },
            ],
        },
        {
            id: "7",
            name: "Tom Baker",
            email: "tom@harcourts.com.au",
            phone: "+61 417 890 123",
            agency: "Harcourts Melbourne",
            role: "Assistant",
            licence: "LIC-VIC-77889",
            licenceStatus: "Pending",
            joined: "01 Aug 2025",
            lastLogin: "Never",
            status: "Pending",
            activities: [{ event: "Account created", time: "01 Aug 2025" }],
        },
        {
            id: "8",
            name: "Priya Sharma",
            email: "priya@ljhooker.com.au",
            phone: "+61 418 901 234",
            agency: "LJ Hooker Parramatta",
            role: "Agent",
            licence: "LIC-NSW-88990",
            licenceStatus: "Verified",
            joined: "10 Sep 2025",
            lastLogin: "Today 11:32am",
            status: "Active",
            activities: [
                { event: "Logged in", time: "Today 11:32am" },
                { event: "Listing created", time: "2 days ago" },
                { event: "Account created", time: "10 Sep 2025" },
            ],
        },
        {
            id: "9",
            name: "Robert Chen",
            email: "robert@stonerealestate.com.au",
            phone: "+61 419 012 345",
            agency: "Stone Real Estate Newtown",
            role: "Agent",
            licence: "LIC-NSW-55667",
            licenceStatus: "Verified",
            joined: "15 Oct 2025",
            lastLogin: "4 days ago",
            status: "Active",
            activities: [
                { event: "Logged in", time: "4 days ago" },
                { event: "Account created", time: "15 Oct 2025" },
            ],
        },
        {
            id: "10",
            name: "Sophie Anderson",
            email: "sophie@jellis.com.au",
            phone: "+61 420 123 456",
            agency: "Jellis Craig Fitzroy",
            role: "Agent",
            licence: "LIC-VIC-22334",
            licenceStatus: "Verified",
            joined: "01 Nov 2025",
            lastLogin: "5 days ago",
            status: "Active",
            activities: [
                { event: "Logged in", time: "5 days ago" },
                { event: "Account created", time: "01 Nov 2025" },
            ],
        },
        {
            id: "11",
            name: "David Kumar",
            email: "david@barryplant.com.au",
            phone: "+61 421 234 567",
            agency: "Barry Plant Doncaster",
            role: "Agent",
            licence: "LIC-VIC-33445",
            licenceStatus: "Verified",
            joined: "10 Nov 2025",
            lastLogin: "1 week ago",
            status: "Active",
            activities: [
                { event: "Logged in", time: "1 week ago" },
                { event: "Account created", time: "10 Nov 2025" },
            ],
        },
        {
            id: "12",
            name: "Nelson Wong",
            email: "nelson@firstnational.com.au",
            phone: "+61 422 345 678",
            agency: "First National Geelong",
            role: "Owner",
            licence: "LIC-VIC-44556",
            licenceStatus: "Verified",
            joined: "15 Dec 2025",
            lastLogin: "3 weeks ago",
            status: "Active",
            activities: [
                { event: "Logged in", time: "3 weeks ago" },
                { event: "Account created", time: "15 Dec 2025" },
            ],
        },
    ];
};
