import { RHFTextField } from './rhf-text-field';
import { RHFFileUpload } from './rhf-file-upload';
import { RHFAutocompleteSchoolDistrict } from './rhf-autocomplete-school-district';
import { RHFAutocompleteUniversity } from './rhf-autocomplete-university';
import { RHFAutocompleteLeadContact } from './rhf-autocomplete-lead-contact';

// ----------------------------------------------------------------------

export const Field = {
  Text: RHFTextField,
  Upload: RHFFileUpload,
  AutocompleteSchoolDistrict: RHFAutocompleteSchoolDistrict,
  AutocompleteUniversity: RHFAutocompleteUniversity,
  AutocompleteLeadContact: RHFAutocompleteLeadContact,
};
