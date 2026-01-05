# Research Report: Taiwan E-Invoice Development Kit

## 1. Executive Summary

The goal is to create `invoicekit`, a modern, modular, and framework-agnostic TypeScript toolkit for Taiwan Electronic Invoices (e-Invoice/eGUI), similar in philosophy to `linekit`.

Currently, developers usually integrate with **Value Added Service Centers (加值中心)** like ECPay (綠界) or EZpay (簡單付) because connecting directly to the Ministry of Finance (MOF) Turnkey system is technically complex and regulated.

**Opportunity**: There is no single, unified TypeScript SDK that abstracts these different providers (MOF, ECPay, EZpay) into a consistent API. Existing libraries are often outdated, provider-specific, or lack TypeScript support.

## 2. The Ecosystem

### A. Ministry of Finance (MOF) Platform

- **Role**: The central government source.
- **Access**:
  - **Turnkey**: For high-volume B2B/B2C issuance. Requires strict certification and MIG 4.0 xml formats.
  - **API (AppID)**: For querying invoice details, winning numbers, and verifying carriers (手機條碼). **Not for issuing B2C invoices** directly without a Turnkey or aggregator.
- **Key APIs**: `getInvoiceDetail`, `getWinningNumbers`, `checkMobileBarCode`.

### B. Third-Party Aggregators (Providers)

- **Role**: Intermediaries that handle the Turnkey complexity. Businesses pay them a fee per invoice.
- **Major Players**:
  - **ECPay (綠界)**: Dominant market share. Uses AES encryption + HashKey/IV.
  - **EZpay (簡單付)**: Another popular option.
  - **Others**: NewebPay (藍新), LINE Pay (sometimes bundles).
- **Mechanism**: RESTful-ish APIs (often XML or JSON with specific encryption).

## 3. Proposed Architecture (`invoicekit`)

Drafting a similar monorepo structure to `linekit`:

```text
packages/
  core/             # Common types (MIG 4.0), validators, utilities
  mof/              # Ministry of Finance Public API (Winning #, Carrier check)
  ecpay/            # ECPay specific implementation
  ezpay/            # EZpay specific implementation
  universal/        # (Optional) Unified Interface for "Issuing"
```

### Module Breakdown

#### 1. `@invoicekit/core`

- **Validators**:
  - Uniform Business No (統一編號) validation (Logic 8-digit check).
  - Mobile Barcode (手機條碼) regex validation (`/^\/[0-9A-Z.+-]{7}$/`).
  - Donate Code (愛心碼) verification.
- **Types**:
  - Shared interfaces for `InvoiceItem`, `Customer`, `VatType` (Taxable, Zero-tax).
- **Utils**:
  - Random number generators for tracking checking.

#### 2. `@invoicekit/mof` (Public Data)

Direct integration with `api.einvoice.nat.gov.tw`.

- **Features**:
  - `getWinningNumbers(term)`: Fetch winning lottery numbers.
  - `verifyMobileBarcode(code)`: Check if a user's phone barcode exists.
  - `getInvoiceDetail(...)`: Query specific invoice info (B2B mostly).

#### 3. `@invoicekit/ecpay` (Issuance)

Wrapper for ECPay's specific encryption/form-posting flow.

- **Features**:
  - `issue(invoiceData)`: Create a new B2C invoice.
  - `void(invoiceNumber)`: Cancel an invoice.
  - `allowance(invoiceNumber)`: Issue a refund/allowance.

## 4. Example Usage (Concept)

```typescript
// 1. Validation (Core)
import { validateTaxId, validateMobileBarcode } from "@invoicekit/core";

if (!validateMobileBarcode("/AB12345")) {
    throw new Error("Invalid barcode");
}

// 2. Fetching Winning Numbers (MOF)
import { mof } from "@invoicekit/mof";
const numbers = await mof.getWinningNumbers("11210"); // Oct 2023

// 3. Issuing Invoice (ECPay Adapter)
import { ECPayClient } from "@invoicekit/ecpay";

const client = new ECPayClient({
    merchantId: "...",
    hashKey: "...",
    hashIv: "..."
});

const result = await client.issue({
    orderId: "ORD-001",
    amount: 1000,
    items: [{ name: "Tech Gadget", count: 1, price: 1000 }],
    carrier: { type: "mobile", id: "/AB12345" }
});
```

## 5. Roadmap Recommendation

1. **Phase 1**: Build `@invoicekit/core` with strict validation logic (Tax ID, Barcodes) as these are universal.
2. **Phase 2**: Build `@invoicekit/mof` to query government open data (Winning numbers are a great "Hello World").
3. **Phase 3**: Implement `@invoicekit/ecpay` as it's the most requested feature for commercial use.

This structure allows you to maintain the same "Clean, Modular, Type-Safe" philosophy as `linekit`.
