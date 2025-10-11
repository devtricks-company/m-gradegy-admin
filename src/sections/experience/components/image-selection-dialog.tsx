'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import Image from 'next/image';

import { Iconify } from 'src/components/iconify';

import type { ExperienceImage } from 'src/lib/orval/generated/model';

// ----------------------------------------------------------------------

type ImageSelectionDialogProps = {
  open: boolean;
  onClose: () => void;
  images: ExperienceImage[];
  selectedImage?: ExperienceImage;
  onSelectImage: (image: ExperienceImage) => void;
};

export function ImageSelectionDialog({
  open,
  onClose,
  images,
  selectedImage,
  onSelectImage,
}: ImageSelectionDialogProps) {
  const handleImageClick = (image: ExperienceImage) => {
    onSelectImage(image);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:gallery-bold" width={24} />
          <Typography variant="h6">Select Experience Image</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Iconify icon="solar:close-circle-bold" width={24} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {images.length === 0 ? (
          <Box
            sx={{
              py: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Iconify icon="solar:gallery-remove-bold" width={64} sx={{ opacity: 0.3 }} />
            <Typography variant="body2" color="text.secondary">
              No images available for this experience type
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ py: 2 }}>
            {images.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    border: selectedImage?.url === image.url ? 2 : 0,
                    borderColor: 'primary.main',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleImageClick(image)}>
                    <Box sx={{ position: 'relative', paddingTop: '66.67%', bgcolor: 'grey.200' }}>
                      <Image
                        src={image.url}
                        alt={
                          typeof image.title === 'string'
                            ? image.title
                            : `Experience image ${index + 1}`
                        }
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      {selectedImage?.url === image.url && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'primary.main',
                            borderRadius: '50%',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Iconify icon="solar:check-circle-bold" width={24} color="white" />
                        </Box>
                      )}
                      {image.default && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            bgcolor: 'success.main',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          Default
                        </Box>
                      )}
                    </Box>
                    {image.title && (
                      <Box sx={{ p: 1.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {typeof image.title === 'string' ? image.title : 'Untitled'}
                        </Typography>
                      </Box>
                    )}
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
}
