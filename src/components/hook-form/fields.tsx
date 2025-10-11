import { RHFTextField } from './rhf-text-field';
import { RHFFileUpload } from './rhf-file-upload';
import { RHFSelect } from './rhf-select';
import { RHFAutocompleteSchoolDistrict } from './rhf-autocomplete-school-district';
import { RHFAutocompleteUniversity } from './rhf-autocomplete-university';
import { RHFAutocompleteLeadContact } from './rhf-autocomplete-lead-contact';
import { RHFSelectExperienceType } from './rhf-select-experience-type';

// ----------------------------------------------------------------------

export const Field = {
  Text: RHFTextField,
  Upload: RHFFileUpload,
  Select: RHFSelect,
  SelectExperienceType: RHFSelectExperienceType,
  AutocompleteSchoolDistrict: RHFAutocompleteSchoolDistrict,
  AutocompleteUniversity: RHFAutocompleteUniversity,
  AutocompleteLeadContact: RHFAutocompleteLeadContact,
};
