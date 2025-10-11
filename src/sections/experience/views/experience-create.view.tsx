'use client';

import { useEffect } from 'react';
import { Box, Card, Grid, Stack, Typography, Divider, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { Form } from 'src/components/hook-form/form-provider';
import { Field } from 'src/components/hook-form/fields';
import { useExperienceTypesControllerFindAll } from 'src/lib/orval/generated/experience-types/experience-types';

import { experienceSchema, defaultValues, type ExperienceFormValues } from '../experience-schema';
import Image from 'next/image';

export function ExperienceCreateView() {
  const methods = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues,
  });

  const { handleSubmit, watch, setValue } = methods;
  const { data: experienceTypes } = useExperienceTypesControllerFindAll();

  const xpCompletion = watch('xpCompletion');
  const experienceType = watch('experienceType');

  // Set "Gradegy" as default experience type when data is loaded
  useEffect(() => {
    if (experienceTypes && !experienceType) {
      const gradegyType = experienceTypes.find((type) => type.title === 'Gradegy');
      if (gradegyType) {
        setValue('experienceType', gradegyType);
      }
    }
  }, [experienceTypes, experienceType, setValue]);

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
              </Box>

              {/* Illustration placeholder */}
              <Box
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
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.25)',
                  },
                }}
              >
                <Stack alignItems="center" spacing={1}>
                  <Iconify icon="solar:gallery-add-bold" width={48} sx={{ opacity: 0.7 }} />
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Upload Image
                  </Typography>
                </Stack>
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
                <Grid container spacing={3}>
                  <Grid item xs={12} md={5}>
                    <Stack spacing={2}>
                      <Field.Select
                        name="category"
                        label="Category"
                        options={[
                          { label: 'All', value: 'all' },
                          { label: 'Academic', value: 'academic' },
                          { label: 'Career', value: 'career' },
                          { label: 'Personal', value: 'personal' },
                        ]}
                      />

                      <Field.Select
                        name="subcategory"
                        label="Subcategory"
                        options={[{ label: 'All', value: 'all' }]}
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
                  <Grid item xs={12} md={8}>
                    <Field.Select
                      name="timing"
                      options={[
                        { label: 'Delay After Previous', value: 'delay_after_previous' },
                        { label: 'Immediate', value: 'immediate' },
                        { label: 'Scheduled', value: 'scheduled' },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Field.Text name="days" label="# Days" type="number" />
                  </Grid>
                  <Grid item xs={12}>
                    <Field.Switch
                      name="completionRequired"
                      label="Completion Req'd"
                      color="error"
                    />
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
                    { label: 'Student', value: 'student' },
                    { label: 'Teacher', value: 'teacher' },
                    { label: 'Auto', value: 'auto' },
                  ]}
                  sx={{ maxWidth: 300 }}
                />

                <Field.Switch name="autoCompletion" label="Auto Complition" color="success" />
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Stack spacing={2}>
                <Field.Switch name="addLinkInText" label="Add Link in text" />

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
                      <Field.Text name="driver1" placeholder="Driver 1" size="small" />
                      <Field.Text name="driver2" placeholder="Driver 2" size="small" />
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
    </DashboardContent>
  );
}
