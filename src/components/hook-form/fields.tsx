import { RHFTextField } from './rhf-text-field';
import { RHFFileUpload } from './rhf-file-upload';
import { RHFSelect } from './rhf-select';
import { RHFSwitch } from './rhf-switch';
import { RHFRating } from './rhf-rating';
import { RHFAutocompleteSchoolDistrict } from './rhf-autocomplete-school-district';
import { RHFAutocompleteUniversity } from './rhf-autocomplete-university';
import { RHFAutocompleteLeadContact } from './rhf-autocomplete-lead-contact';
import { RHFSelectExperienceType } from './rhf-select-experience-type';
import { RHFDatePicker } from './rhf-date-picker';
import { RHFTimePicker } from './rhf-time-picker';

// ----------------------------------------------------------------------

export const Field = {
  Text: RHFTextField,
  Upload: RHFFileUpload,
  Select: RHFSelect,
  Switch: RHFSwitch,
  Rating: RHFRating,
  SelectExperienceType: RHFSelectExperienceType,
  AutocompleteSchoolDistrict: RHFAutocompleteSchoolDistrict,
  AutocompleteUniversity: RHFAutocompleteUniversity,
  AutocompleteLeadContact: RHFAutocompleteLeadContact,
  DatePicker: RHFDatePicker,
  TimePicker: RHFTimePicker,
};
