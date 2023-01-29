<DatePicker
  localeText={{ datePickerToolbarTitle: 'Pick a date' }}
  components={{
    Toolbar: MyToolbar,
  }}
  componentsProps={{
    toolbar: {
      hidden: true,
    },
  }} />;

<DatePicker
  components={{
    ActionBar: CustomActionBar,
    Toolbar: MyToolbar,
  }}
  componentsProps={{
    actionBar: {
      actions: [],
    },

    toolbar: {
      hidden: false,
    },
  }} />;

<DatePicker
  componentsProps={{
    toolbar: {
      toolbarPlaceholder: "__",
      toolbarFormat: "DD / MM / YYYY",
      hidden: false,
    },
  }} />;

<DatePicker
  componentsProps={{
    toolbar: {
      hidden: !isToolbarVisible(x, y),
    },
  }} />;

<DatePicker
  localeText={{
    toolbarTitle: "Title",
  }} />;

<DatePicker
  localeText={{
    datePickerToolbarTitle: 'Pick a Date',
    timePickerToolbarTitle: 'Pick a Time',
    dateTimePickerToolbarTitle: 'Pick a Date and Time',
    dateRangePickerToolbarTitle: 'Pick a Date Range',
  }}
/>;
