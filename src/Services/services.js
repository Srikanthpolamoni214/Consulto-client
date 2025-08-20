export const fetchDoctorById = async (id) => {
    try {
        const response = await fetch(`http://localhost:3400/doctors/${id}`);
        if (!response.ok) throw new Error('Failed to fetch doctor');
        const data = await response.json();
        return data.length > 0 ? data[0] : null;
    } catch (err) {
        console.error("Error fetching doctor:", err);
        throw err;
    }
};
