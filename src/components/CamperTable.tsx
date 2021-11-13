import {
  Button,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useMutation } from 'react-query';
import downloadImage from '../helpers/downloadImage';
import { Camper } from '../types/Camper';
import { downloadCovidImage } from '../queries/images';
import { useUser } from '@auth0/nextjs-auth0';
import { getIsAdminFromUser } from '../helpers';

interface Props {
  campers: Camper[];
}

const CamperTable = ({ campers }: Props) => {
  const { user } = useUser();
  const isAdmin = getIsAdminFromUser(user);

  const { mutate } = useMutation(downloadCovidImage, {
    onSuccess: (data, { covidImageFileName }) => {
      downloadImage(covidImageFileName, data);
    },
  });

  const handleDownloadCovidImage = (covidImageFileName: string) => {
    mutate({ covidImageFileName });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Birthday</TableCell>
            <TableCell>Grade just completed</TableCell>
            <TableCell>Food Alergies</TableCell>
            <TableCell>Parent or Guardian Email</TableCell>
            <TableCell>Emergency Contact Name</TableCell>
            <TableCell>Emergency Contact Number</TableCell>
            <TableCell>Roommate</TableCell>
            <TableCell>Online or Paper Registration</TableCell>
            <TableCell>Waiver Signed Status</TableCell>
            <TableCell>Waiver Signed By</TableCell>
            {isAdmin && <TableCell>Room Assignment</TableCell>}
            <TableCell>Is Adult Leader</TableCell>
            <TableCell>Student Leadership Track</TableCell>
            <TableCell>Camp Attending</TableCell>
            <TableCell>COVID Image Type</TableCell>
            <TableCell>COVID Image</TableCell>
            <TableCell sx={{ minWidth: 300 }}>Notes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {campers.map((camper: Camper) => (
            <TableRow key={camper.id}>
              <TableCell>
                <Link href={`/camperEdit?id=${camper.id}`}>Edit</Link>
              </TableCell>
              <TableCell>{camper.first_name}</TableCell>
              <TableCell>{camper.last_name}</TableCell>
              <TableCell>{camper.gender}</TableCell>
              <TableCell>{camper.birthday}</TableCell>
              <TableCell>{camper.grade_completed}</TableCell>
              <TableCell>{camper.allergies}</TableCell>
              <TableCell>{camper.parent_email}</TableCell>
              <TableCell>{camper.emergency_name}</TableCell>
              <TableCell>{camper.emergency_number}</TableCell>
              <TableCell>{camper.roommate}</TableCell>

              <TableCell>{camper.registration}</TableCell>
              <TableCell>{camper.signed_status}</TableCell>
              <TableCell>{camper.signed_by}</TableCell>
              {isAdmin && <TableCell>{camper.room}</TableCell>}
              <TableCell>{camper.adult_leader}</TableCell>
              <TableCell>{camper.student_leadership_track}</TableCell>
              <TableCell>{camper.camp_attending}</TableCell>
              <TableCell>{camper.covid_image_type}</TableCell>
              <TableCell>
                {camper.covid_image_file_name && (
                  <Button
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      handleDownloadCovidImage(camper.covid_image_file_name)
                    }
                  >
                    Download
                  </Button>
                )}
              </TableCell>
              <TableCell sx={{ minWidth: 300 }}>{camper.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CamperTable;
