// /components/form/contact/ContactsSection.tsx
import React from "react";
import { contactStyles as styles } from "@/styles/components/forms/ContactFormStyles";
import ContactItem, { ContactFormData } from "./ContactItem";

interface ContactsSectionProps {
  contacts: ContactFormData[];
  addContact: () => void;
  removeContact: (index: number) => void;
  handleContactChange: (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  maxContacts?: number;
}

const ContactsSection: React.FC<ContactsSectionProps> = ({
  contacts,
  addContact,
  removeContact,
  handleContactChange,
  maxContacts = 3,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Contacts</h2>
        {contacts.length < maxContacts && (
          <button type="button" onClick={addContact} style={styles.addButton}>
            Ajouter un contact
          </button>
        )}
      </div>

      {contacts.length === 0 && (
        <p style={styles.noContactsMessage}>
          Aucun contact ajouté. Cliquez sur Ajouter un contact pour en créer.
        </p>
      )}

      {contacts.length >= maxContacts && (
        <p style={styles.maxContactsWarning}>
          Maximum {maxContacts} contacts autorisés pour la création initiale.
          Vous pourrez en ajouter d’autres après la création du client.
        </p>
      )}

      {contacts.map((contact, index) => (
        <ContactItem
          key={index}
          contact={contact}
          index={index}
          handleContactChange={handleContactChange}
          removeContact={removeContact}
        />
      ))}
    </div>
  );
};

export default ContactsSection;
