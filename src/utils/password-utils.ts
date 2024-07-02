/**
 * Generates a random password
 * @returns a random password, only for tempurary use (weak generator)
 */
export function generateRandomPassword() {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
}
