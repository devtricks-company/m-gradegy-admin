'use client';

import { useEffect, useState } from 'react';
import { Box, Card, Grid, Stack, Typography, Divider, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { Form } from 'src/components/hook-form/form-provider';
import { Field } from 'src/components/hook-form/fields';
import { useExperienceTypesControllerFindAll } from 'src/lib/orval/generated/experience-types/experience-types';
import { useExperienceImagesControllerFindAll } from 'src/lib/orval/generated/experience-images/experience-images';
import { useAccessControlControllerListOrganizations } from 'src/lib/orval/generated/access-control/access-control';
import { useProjectsControllerFindByOrganization } from 'src/lib/orval/generated/projects/projects';
import { useCategoriesControllerFindByProject } from 'src/lib/orval/generated/categories/categories';
import { useSubcategoriesControllerFindAllByCategory } from 'src/lib/orval/generated/subcategories/subcategories';
import { ExperienceCompletionType, ExperienceDriverType } from 'src/lib/orval/generated/model';

import { experienceSchema, defaultValues, type ExperienceFormValues } from '../experience-schema';
import { ImageSelectionDialog } from '../components/image-selection-dialog';

export function ExperienceCreateView() {
  const [openImageDialog, setOpenImageDialog] = useState(false);

  const methods = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues,
  });

  const { handleSubmit, watch, setValue } = methods;
  const { data: experienceTypes } = useExperienceTypesControllerFindAll();
  const { data: experienceImages } = useExperienceImagesControllerFindAll({
    limit: 1000,
  });

  // Watch form values for cascading filters
  const xpCompletion = watch('xpCompletion');
  const experienceType = watch('experienceType');
  const selectedImage = watch('selectedImage');
  const selectedOrganization = watch('organization');
  const selectedProject = watch('project');
  const selectedCategory = watch('category');
  const timingType = watch('timing');
  const submissionType = watch('submissionType');
  const addLinkInText = watch('addLinkInText');
  const linkTitle = watch('linkTitle');
  const driver1 = watch('driver1');
  const driver2 = watch('driver2');

  // Access Control hooks for cascading filters
  const { data: organizations } = useAccessControlControllerListOrganizations();

  // Fetch projects filtered by selected organization
  const { data: projectsData } = useProjectsControllerFindByOrganization(
    selectedOrganization || '',
    undefined,
    {
      query: {
        enabled: !!selectedOrganization,
      },
    }
  );

  // Fetch categories filtered by selected project
  const { data: categoriesData } = useCategoriesControllerFindByProject(
    selectedProject || '',
    undefined,
    {
      query: {
        enabled: !!selectedProject,
      },
    }
  );

  // Fetch subcategories filtered by selected category
  const { data: subcategoriesData } = useSubcategoriesControllerFindAllByCategory(
    selectedCategory || '',
    undefined,
    {
      query: {
        enabled: !!selectedCategory,
      },
    }
  );

  // Extract data arrays from paginated responses
  const projects = projectsData?.data;
  const categories = categoriesData?.data;
  const subcategories = subcategoriesData?.data;

  // Set "Gradegy" as default experience type when data is loaded
  useEffect(() => {
    if (experienceTypes && !experienceType) {
      const gradegyType = experienceTypes.find((type) => type.title === 'Gradegy');
      if (gradegyType) {
        setValue('experienceType', gradegyType);
      }
    }
  }, [experienceTypes, experienceType, setValue]);

  // Reset project when organization changes
  useEffect(() => {
    setValue('project', undefined);
    setValue('category', undefined);
    setValue('subcategory', undefined);
  }, [selectedOrganization, setValue]);

  // Reset category and subcategory when project changes
  useEffect(() => {
    if (selectedProject) {
      setValue('category', undefined);
      setValue('subcategory', undefined);
    }
  }, [selectedProject, setValue]);

  // Reset subcategory when category changes
  useEffect(() => {
    if (selectedCategory) {
      setValue('subcategory', undefined);
    }
  }, [selectedCategory, setValue]);

  // Filter images by selected experience type
  const filteredImages = experienceType
    ? experienceImages?.data?.filter(
        (image) => image.experienceType.title === experienceType.title
      ) || []
    : [];

  console.log(filteredImages);
  // Use selected image or default to first filtered image
  const displayImage = selectedImage || filteredImages[0];

  const handleOpenImageDialog = () => {
    setOpenImageDialog(true);
  };

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
  };

  const handleSelectImage = (image: typeof displayImage) => {
    setValue('selectedImage', image, { shouldValidate: true });
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('Form data:', data);
      // TODO: Add API call to create experience
    } catch (error) {
      console.error('Error creating experience:', error);
    }
  });

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Add Experience"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Experience', href: paths.dashboard.experience },
          { name: 'Add Experience' },
        ]}
        sx={{ mb: 3 }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {/* First Row: Experience Preview and Form Configuration */}
        <Grid container spacing={3}>
          {/* Left Side - Experience Card Preview */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 3,
                background: experienceType?.color
                  ? `linear-gradient(135deg, ${experienceType.color} 0%, ${experienceType.color}dd 100%)`
                  : 'linear-gradient(135deg, #4fd1c5 0%, #63b3ed 100%)',
                color: 'white',
                height: '100%',
                minHeight: 700,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                transition: 'background 0.3s ease-in-out',
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Field.Text
                  name="title"
                  placeholder="Title"
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      color: 'white',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    },
                  }}
                  inputProps={{
                    style: { textAlign: 'center' },
                  }}
                  sx={{
                    '& .MuiInput-input::placeholder': {
                      color: 'rgba(255,255,255,0.9)',
                      opacity: 1,
                    },
                    '& .MuiFormHelperText-root': {
                      color: 'rgba(255,255,255,0.9)',
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Field.Text
                  name="subtitle"
                  placeholder="SubTitle"
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      color: 'white',
                      fontSize: '1.25rem',
                      fontWeight: 400,
                      textAlign: 'center',
                    },
                  }}
                  inputProps={{
                    style: { textAlign: 'center' },
                  }}
                  sx={{
                    '& .MuiInput-input::placeholder': {
                      color: 'rgba(255,255,255,0.9)',
                      opacity: 1,
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 3, flex: 1 }}>
                <Field.Text
                  name="description"
                  multiline
                  rows={4}
                  placeholder="Description of the experience item to inform the students what they need to do for this task."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' },
                    },
                    '& .MuiOutlinedInput-input::placeholder': {
                      color: 'rgba(255,255,255,0.8)',
                      opacity: 1,
                    },
                  }}
                />

                {/* Display link title if addLinkInText is enabled */}
                {addLinkInText && linkTitle && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 1.5,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      borderRadius: 1,
                      border: '1px solid rgba(255,255,255,0.3)',
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="solar:link-bold" width={20} sx={{ color: 'white' }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'white',
                          fontWeight: 500,
                          textDecoration: 'underline',
                        }}
                      >
                        {linkTitle}
                      </Typography>
                    </Stack>
                  </Box>
                )}
              </Box>

              {/* Illustration placeholder */}
              <Box
                onClick={handleOpenImageDialog}
                sx={{
                  width: '100%',
                  height: 220,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  border: '2px dashed rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.25)',
                    transform: 'scale(1.01)',
                  },
                }}
              >
                {displayImage?.url ? (
                  <Image
                    src={displayImage.url}
                    alt={
                      typeof displayImage.title === 'string'
                        ? displayImage.title
                        : 'Experience image'
                    }
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                ) : (
                  <Stack alignItems="center" spacing={1}>
                    <Iconify icon="solar:gallery-add-bold" width={48} sx={{ opacity: 0.7 }} />
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      Select Image
                    </Typography>
                  </Stack>
                )}
              </Box>

              {/* XP and Complete Button */}
              <Box>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent={'space-between'}
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    {xpCompletion}XP
                  </Typography>
                  {experienceType?.icon && (
                    <Image src={experienceType.icon} width={50} height={50} alt="sdf" />
                  )}
                </Stack>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: '#4ade80',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    py: 1.5,
                    borderRadius: 1.5,
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#22c55e' },
                  }}
                >
                  Completed?
                </Button>
              </Box>
            </Card>
          </Grid>

          {/* Right Side - Form Configuration */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Experience Type Section */}
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Experience Type
                </Typography>
                <Field.SelectExperienceType
                  name="experienceType"
                  label="Experience Type"
                  helperText="Select the type of experience"
                />
              </Card>

              {/* Category and Filters Section */}
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Category and Filters
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={5}>
                    <Stack spacing={2}>
                      <Field.Select
                        name="organization"
                        label="Organization"
                        options={[
                          { label: 'Select Organization', value: '' },
                          ...(organizations?.map((org: any) => ({
                            label: org.title,
                            value: org._id || org.id || org.title,
                          })) || []),
                        ]}
                      />

                      <Field.Select
                        name="project"
                        label="Project"
                        disabled={!selectedOrganization}
                        options={[
                          { label: 'Select Project', value: '' },
                          ...(projects?.map((project: any) => ({
                            label: project.title,
                            value: project._id || project.id || project.title,
                          })) || []),
                        ]}
                      />

                      <Field.Select
                        name="category"
                        label="Category"
                        disabled={!selectedProject}
                        options={[
                          { label: 'Select Category', value: '' },
                          ...(categories?.map((cat: any) => ({
                            label: cat.title,
                            value: cat._id || cat.id || cat.title,
                          })) || []),
                        ]}
                      />

                      <Field.Select
                        name="subcategory"
                        label="Subcategory"
                        disabled={!selectedCategory}
                        options={[
                          { label: 'Select Subcategory', value: '' },
                          ...(subcategories?.map((sub: any) => ({
                            label: sub.title,
                            value: sub._id || sub.id || sub.title,
                          })) || []),
                        ]}
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Or
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <Stack spacing={2}>
                      <Field.Select
                        name="tags"
                        label="Tags"
                        options={[{ label: 'All', value: 'all' }]}
                      />

                      <Field.Select
                        name="educationPhase"
                        label="Education Phases"
                        options={[{ label: 'All', value: 'all' }]}
                      />

                      <Field.Select
                        name="semester"
                        label="Semester"
                        options={[{ label: 'All', value: 'all' }]}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Card>

              {/* Timing Section */}
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Timing
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field.Select
                      name="timing"
                      label="Timing Type"
                      options={[
                        { label: 'Delay After Previous', value: 'delay_after_previous' },
                        { label: 'Start Date and Length', value: 'start_date_and_length' },
                        { label: 'Date Range', value: 'date_range' },
                      ]}
                    />
                  </Grid>

                  {/* Delay After Previous - Show Days field */}
                  {timingType === 'delay_after_previous' && (
                    <Grid item xs={12} md={6}>
                      <Field.Text name="days" label="# Days" type="number" />
                    </Grid>
                  )}

                  {/* Start Date and Length - Show DatePicker and Length field */}
                  {timingType === 'start_date_and_length' && (
                    <>
                      <Grid item xs={12} md={6}>
                        <Field.DatePicker name="startDate" label="Start Date" />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field.Text name="length" label="Length (Days)" type="number" />
                      </Grid>
                    </>
                  )}

                  {/* Date Range - Show Start Date/Time and End Date/Time */}
                  {timingType === 'date_range' && (
                    <>
                      <Grid item xs={12} md={6}>
                        <Field.DatePicker name="startDate" label="Start Date" />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field.TimePicker name="startTime" label="Start Time" />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field.DatePicker name="endDate" label="End Date" />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field.TimePicker name="endTime" label="End Time" />
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12}>
                    <Field.Switch
                      name="completionRequired"
                      label="Completion Req'd"
                      color="primary"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field.Switch name="endWithParent" label="End with Parent" color="primary" />
                  </Grid>
                </Grid>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        {/* Second Row: Motivational Design and Additional Section */}
        <Grid container spacing={3} sx={{ mt: 0 }}>
          {/* Left Column - Motivational Design */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <Iconify icon="solar:play-bold" width={20} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Motivational Design
                </Typography>
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Field.Text name="xpCompletion" label="XP for Completion" type="number" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Field.Text name="xpViewing" label="XP for viewing" type="number" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Field.Text name="gems" label="Gems" type="number" />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Stack spacing={2}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Submission (completion types)
                </Typography>
                <Field.Select
                  name="submissionType"
                  options={[
                    { label: 'Student', value: ExperienceCompletionType.student },
                    { label: 'Photo', value: ExperienceCompletionType.photo },
                    { label: 'Admin', value: ExperienceCompletionType.admin },
                    { label: 'Link', value: ExperienceCompletionType.link },
                  ]}
                  sx={{ maxWidth: 300 }}
                />

                {submissionType === ExperienceCompletionType.link && (
                  <Field.Text
                    name="submissionLink"
                    label="Submission Link URL"
                    placeholder="https://example.com"
                    type="url"
                    sx={{ maxWidth: 300 }}
                  />
                )}

                <Field.Switch name="autoCompletion" label="Auto Complition" color="success" />
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Stack spacing={2}>
                <Field.Switch name="addLinkInText" label="Add Link in text" />

                {addLinkInText && (
                  <Stack spacing={2} sx={{ ml: 2 }}>
                    <Field.Text
                      name="linkTitle"
                      label="Link Title"
                      placeholder="Enter link title"
                      size="small"
                    />
                    <Field.Text
                      name="linkUrl"
                      label="Link URL"
                      placeholder="https://example.com"
                      type="url"
                      size="small"
                    />
                  </Stack>
                )}

                <Field.Switch name="notification" label="Notification" color="error" />
              </Stack>
            </Card>
          </Grid>

          {/* Right Column - Tags and Advanced */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              {/* Tags Section */}
              <Card sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                  <Iconify icon="solar:tag-bold" width={20} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Tags
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Driver
                    </Typography>
                    <Stack spacing={1.5}>
                      <Field.Select
                        name="driver1"
                        label="Driver 1"
                        size="small"
                        options={[
                          { label: 'Select Driver 1', value: '' },
                          ...Object.entries(ExperienceDriverType)
                            .filter(([_, value]) => value !== driver2)
                            .map(([key, value]) => ({
                              label: key.replace(/TAG$/, ' TAG'),
                              value,
                            })),
                        ]}
                      />
                      <Field.Select
                        name="driver2"
                        label="Driver 2"
                        size="small"
                        options={[
                          { label: 'Select Driver 2', value: '' },
                          ...Object.entries(ExperienceDriverType)
                            .filter(([_, value]) => value !== driver1)
                            .map(([key, value]) => ({
                              label: key.replace(/TAG$/, ' TAG'),
                              value,
                            })),
                        ]}
                      />
                    </Stack>
                  </Box>

                  <Field.Text name="levelOfProgression" label="Level of Progression" size="small" />

                  <Field.Text name="persona" label="Persona" size="small" />

                  <Divider sx={{ my: 2 }} />

                  {/* Milestone */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">Milestone</Typography>
                    <Field.Switch name="milestone" color="error" />
                  </Stack>

                  {/* Weight */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">Weight</Typography>
                    <Field.Rating
                      name="weight"
                      max={3}
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: '#fbbf24',
                        },
                      }}
                    />
                  </Stack>

                  {/* Difficulty */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">Difficulty</Typography>
                    <Field.Switch name="difficulty" color="error" />
                  </Stack>

                  {/* Fire */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">fire</Typography>
                    <Field.Rating
                      name="fire"
                      max={4}
                      icon={<span style={{ fontSize: '20px' }}>🔥</span>}
                      emptyIcon={
                        <span
                          style={{
                            fontSize: '20px',
                            filter: 'grayscale(100%)',
                            opacity: 0.3,
                          }}
                        >
                          🔥
                        </span>
                      }
                    />
                  </Stack>
                </Stack>
              </Card>

              {/* Advanced Section */}
              <Card sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                  <Iconify icon="solar:settings-bold" width={20} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Advanced
                  </Typography>
                </Stack>

                <Stack spacing={2.5}>
                  {/* Past due */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">Past due?</Typography>
                    <Field.Switch name="pastDue" color="error" />
                  </Stack>
                </Stack>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button variant="outlined" size="large" sx={{ minWidth: 120 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" size="large" sx={{ minWidth: 120 }}>
            Create Experience
          </Button>
        </Stack>
      </Form>

      {/* Image Selection Dialog */}
      <ImageSelectionDialog
        open={openImageDialog}
        onClose={handleCloseImageDialog}
        images={filteredImages}
        selectedImage={selectedImage}
        onSelectImage={handleSelectImage}
      />
    </DashboardContent>
  );
}
