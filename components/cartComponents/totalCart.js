export const totalRow = (suma, totalPoints) => {
    return `
        <tr>
            <td colspan="3" class="px-4 py-2 text-center text-white text-lg font-bold border-2 border-gray-800">
                Total: $${suma.toFixed(2)}
            </td>
            <td colspan="2" class="px-4 py-2 text-center text-white text-lg font-bold border-2 border-gray-800">
                Total Puntos: ${totalPoints}
            </td>
        </tr>
    `;
};