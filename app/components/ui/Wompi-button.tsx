'use client';

import React, { useEffect, useState } from 'react';
import { experience, mailerLite, wompiAPI } from '@/app/variables';
import MailerLite from '@mailerlite/mailerlite-nodejs';
import { formatDateToMailerLite, trackFbPixel } from '@/app/lib/utils';
import { AxiosError } from 'axios';

interface WompiProps {
  reference: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  numberPrefix?: string;
};

const WompiWidgetCheckout = ({
  reference, email, fullName, phoneNumber, numberPrefix
}: WompiProps, hashHex: string) => {
  // Wompi Widget Checkout comes from the Wompi script in layout.tsx
  // @ts-ignore
  if (!phoneNumber || !numberPrefix) return new WidgetCheckout({
    currency: wompiAPI.currency,
    amountInCents: wompiAPI.amountInCents,
    reference: reference,
    publicKey: wompiAPI.publicKey,
    signature: { integrity: hashHex },
  });
  // @ts-ignore
  return new WidgetCheckout({
    currency: wompiAPI.currency,
    amountInCents: wompiAPI.amountInCents,
    reference: reference,
    publicKey: wompiAPI.publicKey,
    signature: { integrity: hashHex },
    customerData: {
      email: email,
      fullName: fullName,
      phoneNumber: phoneNumber,
      phoneNumberPrefix: numberPrefix
    }
  });
};

interface WompiButtonProps extends WompiProps {
  className?: string;
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
  disabled?: boolean;
}

// Wompi Button component
const WompiButton = ({
  reference, email, fullName, phoneNumber, numberPrefix, className, children, type = "button", disabled = false
}: WompiButtonProps) => {
  const [hashHex, setHashHex] = useState<string | null>(null);

  useEffect(() => {
    const computeHash = async () => {
      const signature = reference + wompiAPI.amountInCents + wompiAPI.currency + wompiAPI.integrityKey;
      const encodedText = new TextEncoder().encode(signature);
      const hashBuffer = await crypto.subtle.digest("SHA-256", encodedText);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setHashHex(hash);
    };

    computeHash();
  }, [reference]);

  const handlePayment = (hashHex: string) => {
    const widget = WompiWidgetCheckout({ reference, email, fullName, phoneNumber, numberPrefix }, hashHex);
    trackFbPixel('InitiateCheckout', {
      content_ids: [reference],
      content_type: 'product',
      content_category: 'experience',
      content_name: experience.name,
      value: wompiAPI.amountInCents / 100,
      currency: wompiAPI.currency,
    });

    widget.open((result: WompiResponse) => {
      var transaction = result.transaction;
      if (transaction.status === "APPROVED") {
        // Record transaction on MailerLite
        new MailerLite({ api_key: mailerLite.apiKey || "" }).subscribers
          .createOrUpdate({
            email: transaction.customerEmail,
            fields: {
              purchase_id: reference,
              purchase_date: formatDateToMailerLite(),
              purchase_amount: wompiAPI.amountInCents / 100,
              purchase_currency: wompiAPI.currency,
            },
          })
          .catch((error: AxiosError) => {
            if (error.response) console.error(error.response.data);
          });

        trackFbPixel('Purchase', {
          content_ids: [reference],
          content_type: 'product',
          content_category: 'experience',
          content_name: experience.name,
          currency: wompiAPI.currency,
          value: wompiAPI.amountInCents / 100
        });
      }
    });
  };

  return (
    <>
      <button
        type={type}
        className={hashHex ? className : className + " opacity-50 cursor-not-allowed"}
        disabled={!hashHex}
        onClick={() => hashHex && handlePayment(hashHex)}
      >
        <span className="inline-block mr-2 align-middle -translate-y-[8%]">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 229.5 229.5" xmlns="http://www.w3.org/2000/svg">
            <path d="M214.419 32.12A7.502 7.502 0 0 0 209 25.927L116.76.275a7.496 7.496 0 0 0-4.02 0L20.5 25.927a7.5 7.5 0 0 0-5.419 6.193c-.535 3.847-12.74 94.743 18.565 139.961 31.268 45.164 77.395 56.738 79.343 57.209a7.484 7.484 0 0 0 3.522 0c1.949-.471 48.076-12.045 79.343-57.209 31.305-45.217 19.1-136.113 18.565-139.961zm-40.186 53.066l-62.917 62.917c-1.464 1.464-3.384 2.197-5.303 2.197s-3.839-.732-5.303-2.197l-38.901-38.901a7.497 7.497 0 0 1 0-10.606l7.724-7.724a7.5 7.5 0 0 1 10.606 0l25.874 25.874 49.89-49.891a7.497 7.497 0 0 1 10.606 0l7.724 7.724a7.5 7.5 0 0 1 0 10.607z" />
          </svg>
        </span>
        {children}
      </button>
    </>
  );
};

export default WompiButton;

type WidgetProps = {
  currency: string, // USD or COP
  amountInCents: number,
  reference: string,
  publicKey: string,
  signature: {
    integrity: string
  },
  redirectUrl?: string, // Optional
  expirationTime?: string, // Optional
  defaultLanguage?: string, // Optional
  taxInCents?: { // Optional
    vat: number,
  },
  customerData: { // Optional
    email: string,
    fullName: string,
    phoneNumber: string, // 3040777777
    phoneNumberPrefix: string, // +57
    legalId?: string, // 123456789
    legalIdType?: string // CC, CE, NIT, etc
  },
  shippingAddress?: { // Optional
    addressLine1: string, // Calle 123 # 4-5
    city: string, // Ciudad de Panama
    phoneNumber: string, // 63608989
    region: string, // Panama
    country: string // PA
  }
}


type WompiResponse = {
  transaction: {
    redirectUrl: string | null,
    amountInCents: number,
    reference: string,
    currency: string,
    signature: string,
    shippingAddress: string | null,
    taxes: [],
    customerData: {
      deviceId: string,
      fullName: string,
      browserInfo: {
        browserTz: string,
        browserLanguage: string,
        browserUserAgent: string,
        browserColorDepth: string,
        browserScreenWidth: string,
        browserScreenHeight: string
      },
      phoneNumber: string, // 3040777777
      deviceDataToken: string
    },
    customerEmail: string,
    merchantUserId: string,
    sessionId: string,
    paymentMethodType: string,
    customerNumberPrefix: string, // +57
    paymentMethod: {
      type: string,
      extra: {
        name: string,
        brand: string, // VISA
        cardType: string, // CREDIT
        lastFour: string, // 4242
        isThreeDs: boolean,
        threeDsAuth: {
          threeDsAuth: {
            currentStep: string, // AUTHENTICATION
            currentStepStatus: string // COMPLETED
          }
        },
        threeDsAuthType: string | null,
        externalIdentifier: string,
        processorResponseCode: string // 00
      },
      installments: number // 1
    },
    billingData: {
      legalIdType: string // CC
      legalId: string // 1234567890
    },
    is_three_ds: boolean,
    id: string,
    createdAt: string,
    finalizedAt: string,
    status: string, // APPROVED
    statusMessage: string | null,
    paymentSourceId: string | null,
    paymentLinkId: string | null,
    billId: string | null,
    tipInCents: string | null,
    merchant: {
      id: number, // 12010
      name: string, // AVE GROUP SAS
      legalName: string, // AVE GROUP SAS
      contactName: string, // ESTEBAN CASTILLO
      phoneNumber: string, // +573007759857
      logoUrl: string | null,
      legalIdType: string, // NIT
      email: string, // diradmin@aveonline.co
      legalId: string, // 900595261
      publicKey: string // pub_test_syWu...
    },
    canRetry: boolean,
    signatureIntegrityRetry: string | null
  }
}