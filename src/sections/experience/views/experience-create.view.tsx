'use client';

import {
  Box,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Button,
  Divider,
} from '@mui/material';
import { useState } from 'react';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { paths } from 'src/routes/paths';

export function ExperienceCreateView() {
  const [experienceType, setExperienceType] = useState('');
  const [timing, setTiming] = useState('delay_after_previous');
  const [days, setDays] = useState(0);
  const [completionRequired, setCompletionRequired] = useState(true);
  const [category, setCategory] = useState('all');
  const [subcategory, setSubcategory] = useState('all');
  const [tags, setTags] = useState('all');
  const [educationPhase, setEducationPhase] = useState('all');
  const [semester, setSemester] = useState('all');
  const [xpCompletion, setXpCompletion] = useState(0);
  const [xpViewing, setXpViewing] = useState(0);
  const [gems, setGems] = useState(0);
  const [submissionType, setSubmissionType] = useState('student');
  const [autoCompletion, setAutoCompletion] = useState(true);
  const [addLinkInText, setAddLinkInText] = useState(false);
  const [notification, setNotification] = useState(true);

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

      <Grid container spacing={3}>
        {/* Left Side - Experience Card Preview */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #4fd1c5 0%, #63b3ed 100%)',
              color: 'white',
              height: '100%',
              minHeight: 700,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
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
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
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
              <TextField
                fullWidth
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
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  0XP
                </Typography>
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
              <FormControl fullWidth>
                <InputLabel>Select Experience Type</InputLabel>
                <Select
                  value={experienceType}
                  onChange={(e) => setExperienceType(e.target.value)}
                  label="Select Experience Type"
                >
                  <MenuItem value="project">Project</MenuItem>
                  <MenuItem value="assignment">Assignment</MenuItem>
                  <MenuItem value="activity">Activity</MenuItem>
                  <MenuItem value="reading">Reading</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="quiz">Quiz</MenuItem>
                  <MenuItem value="discussion">Discussion</MenuItem>
                  <MenuItem value="presentation">Presentation</MenuItem>
                </Select>
              </FormControl>
            </Card>

            {/* Category and Filters Section */}
            <Card sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <Stack spacing={2}>
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        label="Category"
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="academic">Academic</MenuItem>
                        <MenuItem value="career">Career</MenuItem>
                        <MenuItem value="personal">Personal</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Subcategory</InputLabel>
                      <Select
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        label="Subcategory"
                      >
                        <MenuItem value="all">All</MenuItem>
                      </Select>
                    </FormControl>
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
                    <FormControl fullWidth>
                      <InputLabel>Tags</InputLabel>
                      <Select
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        label="Tags"
                      >
                        <MenuItem value="all">All</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Education Phases</InputLabel>
                      <Select
                        value={educationPhase}
                        onChange={(e) => setEducationPhase(e.target.value)}
                        label="Education Phases"
                      >
                        <MenuItem value="all">All</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Semester</InputLabel>
                      <Select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        label="Semester"
                      >
                        <MenuItem value="all">All</MenuItem>
                      </Select>
                    </FormControl>
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
                  <FormControl fullWidth>
                    <Select
                      value={timing}
                      onChange={(e) => setTiming(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="delay_after_previous">Delay After Previous</MenuItem>
                      <MenuItem value="immediate">Immediate</MenuItem>
                      <MenuItem value="scheduled">Scheduled</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="# Days"
                    type="number"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={completionRequired}
                        onChange={(e) => setCompletionRequired(e.target.checked)}
                        color="error"
                      />
                    }
                    label="Completion Req'd"
                  />
                </Grid>
              </Grid>
            </Card>

            {/* Motivational Design Section */}
            <Card sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <Iconify icon="solar:play-bold" width={20} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Motivational Design
                </Typography>
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="XP for Completion"
                    type="number"
                    value={xpCompletion}
                    onChange={(e) => setXpCompletion(Number(e.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="XP for viewing"
                    type="number"
                    value={xpViewing}
                    onChange={(e) => setXpViewing(Number(e.target.value))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Gems"
                    type="number"
                    value={gems}
                    onChange={(e) => setGems(Number(e.target.value))}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Stack spacing={2}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Submission (completion types)
                </Typography>
                <FormControl fullWidth sx={{ maxWidth: 300 }}>
                  <Select
                    value={submissionType}
                    onChange={(e) => setSubmissionType(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="teacher">Teacher</MenuItem>
                    <MenuItem value="auto">Auto</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={autoCompletion}
                      onChange={(e) => setAutoCompletion(e.target.checked)}
                      color="success"
                    />
                  }
                  label="Auto Complition"
                />
              </Stack>
            </Card>

            {/* Additional Options Section */}
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={addLinkInText}
                      onChange={(e) => setAddLinkInText(e.target.checked)}
                    />
                  }
                  label="Add Link in text"
                />

                <Divider />

                <FormControlLabel
                  control={
                    <Switch
                      checked={notification}
                      onChange={(e) => setNotification(e.target.checked)}
                      color="error"
                    />
                  }
                  label="Notification"
                />
              </Stack>
            </Card>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2 }}>
              <Button variant="outlined" size="large" sx={{ minWidth: 120 }}>
                Cancel
              </Button>
              <Button variant="contained" size="large" sx={{ minWidth: 120 }}>
                Create Experience
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
