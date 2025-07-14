import PDFDocument from 'pdfkit';
import axios from 'axios';

export const generatePdf = async (req, res) => {
    try {
        const user = req.user;
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${user.name}_profile.pdf`);
        doc.pipe(res);
        doc.fontSize(20).text('User Profile', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Name: ${user.name}`);
        doc.text(`Email: ${user.email}`);
        doc.text(`Account Status: ${user.isBlocked ? 'Blocked' : 'Active'}`);
        doc.text(`Created At: ${new Date(user.createdAt).toLocaleString()}`);
        doc.text(`Updated At: ${new Date(user.updatedAt).toLocaleString()}`);
        doc.moveDown();
        if (user.image) {
            try {
                const imageResponse = await axios.get(user.image, { responseType: 'arraybuffer' });
                doc.image(imageResponse.data, {
                    fit: [250, 250],
                    align: 'center',
                    valign: 'center'
                });
            } catch (error) {
                console.error('Error fetching or processing image:', error);
            }
        }
        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating PDF');
    }
};
