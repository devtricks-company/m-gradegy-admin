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
  Rating,
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

  // Tags section states
  const [driver1, setDriver1] = useState('');
  const [driver2, setDriver2] = useState('');
  const [levelOfProgression, setLevelOfProgression] = useState('');
  const [persona, setPersona] = useState('');

  // Advanced section states
  const [pastDue, setPastDue] = useState(false);
  const [milestone, setMilestone] = useState(false);
  const [weight, setWeight] = useState(3);
  const [difficulty, setDifficulty] = useState(false);
  const [fire, setFire] = useState(4);

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

      {/* First Row: Experience Preview and Form Configuration */}
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

            <Divider sx={{ my: 3 }} />

            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={addLinkInText}
                    onChange={(e) => setAddLinkInText(e.target.checked)}
                  />
                }
                label="Add Link in text"
              />

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
                    <TextField
                      placeholder="Driver 1"
                      value={driver1}
                      onChange={(e) => setDriver1(e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      placeholder="Driver 2"
                      value={driver2}
                      onChange={(e) => setDriver2(e.target.value)}
                      fullWidth
                      size="small"
                    />
                  </Stack>
                </Box>

                <TextField
                  label="Level of Progression"
                  value={levelOfProgression}
                  onChange={(e) => setLevelOfProgression(e.target.value)}
                  fullWidth
                  size="small"
                />

                <TextField
                  label="Persona"
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  fullWidth
                  size="small"
                />

                <Divider sx={{ my: 2 }} />

                {/* Milestone */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Milestone</Typography>
                  <Switch
                    checked={milestone}
                    onChange={(e) => setMilestone(e.target.checked)}
                    color="error"
                  />
                </Stack>

                {/* Weight */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Weight</Typography>
                  <Rating
                    value={weight}
                    onChange={(event, newValue) => setWeight(newValue || 0)}
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
                  <Switch
                    checked={difficulty}
                    onChange={(e) => setDifficulty(e.target.checked)}
                    color="error"
                  />
                </Stack>

                {/* Fire */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">fire</Typography>
                  <Stack direction="row" spacing={0.5}>
                    {[1, 2, 3, 4].map((index) => (
                      <Box
                        key={index}
                        onClick={() => setFire(index)}
                        sx={{
                          cursor: 'pointer',
                          fontSize: '20px',
                          filter: index <= fire ? 'grayscale(0%)' : 'grayscale(100%)',
                          opacity: index <= fire ? 1 : 0.3,
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        🔥
                      </Box>
                    ))}
                  </Stack>
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
                  <Switch
                    checked={pastDue}
                    onChange={(e) => setPastDue(e.target.checked)}
                    color="error"
                  />
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
        <Button variant="contained" size="large" sx={{ minWidth: 120 }}>
          Create Experience
        </Button>
      </Stack>
    </DashboardContent>
  );
}
