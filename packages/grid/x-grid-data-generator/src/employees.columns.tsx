import './style/real-data-stories.css';
import {
  generateName,
  randomAvatar,
  randomCity,
  randomCompanyName,
  randomCountry,
  randomCreatedDate,
  randomEmail,
  randomId,
  randomJobTitle,
  randomPhoneNumber,
  randomRating,
  randomUpdatedDate,
  randomUrl,
  randomUserName,
} from './services/';

import {
  AvatarRenderer,
  CountryRenderer,
  EmailRenderer,
  LinkRenderer,
  RatingRenderer,
} from './renderer';

export const employeeColumns: any[] = [
  {
    field: 'id',
    generateData: randomId,
    hide: true,
  },
  {
    field: 'avatar',
    headerName: '',
    sortable: false,
    generateData: randomAvatar,
    cellRenderer: AvatarRenderer,
  },
  {
    field: 'name',
    headerName: 'Name',
    generateData: generateName,
    // valueGetter: (params=> params.data['avatar']),
    sortDirection: 'asc',
    sortIndex: 1,
    width: 120,
  },
  {
    field: 'email',
    headerName: 'Email',
    generateData: randomEmail,
    cellRenderer: EmailRenderer,
    disableClickEventBubbling: true,
    width: 150,
  },
  {
    field: 'phone',
    headerName: 'phone',
    generateData: randomPhoneNumber,
    width: 150,
  },
  {
    field: 'username',
    headerName: 'Username',
    generateData: randomUserName,
    width: 150,
  },
  {
    field: 'website',
    headerName: 'website',
    generateData: randomUrl,
    cellRenderer: LinkRenderer,
    width: 160,
  },
  {
    field: 'rating',
    headerName: 'Rating',
    generateData: randomRating,
    cellRenderer: RatingRenderer,
    sortDirection: 'desc',
    sortIndex: 0,
    width: 180,
  },
  {
    field: 'city',
    headerName: 'City',
    generateData: randomCity,
    width: 100,
  },
  {
    field: 'country',
    headerName: 'Country',
    generateData: randomCountry,
    cellRenderer: CountryRenderer,
    width: 150,
  },
  {
    field: 'company',
    headerName: 'Company',
    generateData: randomCompanyName,
    width: 180,
  },
  {
    field: 'position',
    headerName: 'Position',
    generateData: randomJobTitle,
    width: 180,
  },
  {
    field: 'lastUpdated',
    headerName: 'Updated on',
    generateData: randomUpdatedDate,
    type: 'dateTime',
    width: 180,
  },
  {
    field: 'dateCreated',
    headerName: 'Created on',
    generateData: randomCreatedDate,
    type: 'date',
    width: 150,
  },
];
