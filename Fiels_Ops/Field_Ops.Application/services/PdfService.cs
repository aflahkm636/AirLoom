using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Field_Ops.Application.Contracts.Service;
using Field_Ops.Application.DTO.BIllingDto;

namespace Field_Ops.Infrastructure.Services
{
    public class PdfService : IPdfService
    {
        public byte[] GenerateInvoicePdf(InvoicePdfDto invoice)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(30);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    page.Header().Element(c => BuildHeader(c, invoice));
                    page.Content().Element(c => BuildContent(c, invoice));
                    page.Footer().AlignCenter()
                        .Text($"Generated on {DateTime.Now:dd MMM yyyy}");
                });
            });

            return document.GeneratePdf();
        }

        private void BuildHeader(IContainer container, InvoicePdfDto invoice)
        {
            container.Row(row =>
            {
                row.RelativeItem().Column(col =>
                {
                    col.Item().Text("FIELD_OPS").FontSize(20).Bold();
                    col.Item().Text("Monthly Service Invoice");
                });

                row.ConstantItem(200).AlignRight().Column(col =>
                {
                    col.Item().Text($"Invoice #: {invoice.InvoiceNumber}").Bold();
                    col.Item().Text($"Billing Month: {invoice.BillMonth:MMM yyyy}");
                });
            });
        }

        private void BuildContent(IContainer container, InvoicePdfDto invoice)
        {
            container.Column(col =>
            {
                col.Spacing(20);

                col.Item().Text($"Customer: {invoice.CustomerName}");
                col.Item().Text($"Email: {invoice.CustomerEmail}");

                col.Item().Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn(4);
                        columns.RelativeColumn(2);
                    });

                    table.Header(header =>
                    {
                        header.Cell().Text("Description").Bold();
                        header.Cell().AlignRight().Text("Amount").Bold();
                    });

                    table.Cell().Text("Subscription Charges");
                    table.Cell().AlignRight().Text(invoice.SubscriptionAmount.ToString("₹0.00"));

                    table.Cell().Text("Extra Usage Charges");
                    table.Cell().AlignRight().Text(invoice.ExtraUsageAmount.ToString("₹0.00"));
                });

                col.Item().AlignRight().Column(total =>
                {
                    total.Item().Text($"Subtotal: ₹{invoice.Amount:0.00}");
                    total.Item().Text($"Discount ({invoice.DiscountPercent}%): -₹{invoice.DiscountAmount:0.00}");
                    total.Item().Text($"Tax ({invoice.TaxPercent}%): ₹{invoice.TaxAmount:0.00}");
                    total.Item().Text($"Total: ₹{invoice.TotalAmount:0.00}")
                        .Bold()
                        .FontSize(14);
                });
            });
        }
    }
}
