export default function useAuth() {
    const role = "superadmin";
    const name = "Akash";
    const logout = () => {
        // placeholder logout implementation
        console.log("User logged out");
    };
    return { role, name, logout };
}
