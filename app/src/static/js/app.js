// Enums would have been better here
// 1. Constants 
const Makes = {
  Ford: 'Ford',
  Toyota: 'Toyota',
  Honda: 'Honda',
  Cadillac: 'Cadillac',
  Porsche: 'Porsche',
};
const Colors = {
  Beige: 'Beige',
  Black: 'Black',
  Blue: 'Blue',
  Brown: 'Brown',
  Gold: 'Gold',
  Gray: 'Gray',
  Green: 'Green',
  Orange: 'Orange',
  Purple: 'Purple',
  Red: 'Red',
  Silver: 'Silver',
  White: 'White',
  Yellow: 'Yellow'
};
const Category = {
  CargoVan: 'Cargo Van',
  Convertible: 'Convertible',
  Coupe: 'Coupe',
  Hatchback: 'Hatchback',
  Minivan: 'Gold',
  PassengerVan: 'Passenger Van',
  PickupTruck: 'Pickup Truck',
  SUV: 'SUV',
  Sedan: 'Sedan',
  Wagon: 'Wagon',
};

const starterCars = [
  {
    make: 'Ford',
    model: 'F150',
    carPackage: 'Base',
    color: 'Silver',
    year: 2010,
    category: 'Pickup Truck',
    mileage: 120123,
    price: 1999900,
  },
  {
    make: 'Toyota',
    model: 'Camry',
    carPackage: 'SE',
    color: 'White',
    year: 2018,
    category: 'Sedan',
    mileage: 3999,
    price: 2899000,
  },
  {
    make: 'Toyota',
    model: 'RAV4',
    carPackage: 'XSE',
    color: 'Red',
    year: 2018,
    category: 'SUV',
    mileage: 24001,
    price: 2275000,
  },
  {
    make: 'Ford',
    model: 'Bronco',
    carPackage: 'Badlands',
    color: 'Orange',
    year: 2022,
    category: 'SUV',
    mileage: 1,
    price: 4499000,
  }
];

// 2. App container
function App() {
  return <TodoListCard />
}

// 3. List of Cars
function TodoListCard() {
  const { Container, Row, Col } = ReactBootstrap;
  const [items, setItems] = React.useState(null);
  const [logs, setLogs] = React.useState([]);
  const [showLogs, setShowLogs] = React.useState(false);

  React.useEffect(() => {
    async function callingAllLogs() {
      const res = await getAllLogs();
      setLogs(res);
    }

    async function callingAllCars() {
      let allCars = await getAllCars();
      if (allCars.length === 0) {
        starterCars.forEach(async (car) => {
          addToDb(car)
        })
        allCars = await getAllCars();
      }
      setItems(allCars);
    }
    callingAllLogs();
    callingAllCars();
  }, []);

  const onNewItem = React.useCallback(
    newItem => {
      setItems([...items, newItem]);
    },
    [items],
  );

  const onItemRemoval = React.useCallback(
    item => {
      const index = items.findIndex(i => i.id === item.id);
      setItems([...items.slice(0, index), ...items.slice(index + 1)]);
    },
    [items],
  );

  if (items === null) return 'Loading...';

  return (
    <Container>
    <Row>
      <Col>
      <button onClick={() => setShowLogs(!showLogs)}>{`${showLogs ? 'Hide' : 'Show'}`} Logs</button>
      <h2>All Cars</h2>
      {items.length === 0 && (
        <p className="text-center">No items yet! Add one above!</p>
      )}
      {items.map(item => (
        <ItemDisplay
          item={item}
          key={item.id}
          onItemRemoval={onItemRemoval}
        />
      ))}
      </Col>
      <Col>
        <h2>Add Car</h2>
        <AddItemForm onNewItem={onNewItem} />
      </Col>
    </Row>
    {showLogs && (
      <Container style={{
        position: 'absolute',
        background: 'white',
        right: 0,
        bottom: 0,
        width: '33%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 50
      }}>
        <p>Logs</p>
        {logs && logs.map((log) => {
          return (
            <p style={{
              color: log.action === 'Deleting' ? 'red' : 'green'
            }}>{`${log.timestamp} ${log.action} ${log.make} ${log.model}`}</p>
          )
        })}
      </Container>
    )}
    </Container>
  );
}

// 3. Add car form
function AddItemForm({ onNewItem }) {
  const { Form, Button } = ReactBootstrap;
  const [make, setMake] = React.useState('');
  const [model, setModel] = React.useState('');
  const [carPackage, setCarPackage] = React.useState('');
  const [color, setColor] = React.useState('');
  const [year, setYear] = React.useState();
  const [category, setCategory] = React.useState('');
  const [mileage, setMileage] = React.useState();
  const [price, setPrice] = React.useState();
  const [submitting, setSubmitting] = React.useState(false);

  const submitNewItem = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await addToDb({
      make: make,
      model: model,
      carPackage: carPackage,
      color: color,
      year: year,
      category: category,
      mileage: mileage,
      price: price,
    })

    const item = await res.json();
    onNewItem(item);
    setSubmitting(false);
  };

  return (
    <Form onSubmit={submitNewItem}>
      <Form.Group className="mb-3" controlId="Make">
        <Form.Label>Make</Form.Label>
        <Form.Control
          required
          value={make}
          onChange={e => setMake(e.target.value)}
          type="text"
          placeholder="Model Item"
          aria-describedby="basic-addon1"
          as="select">
            <option value="">-</option>
            {Makes && Object.values(Makes).map((make) => {
              return (
                <option value={make}>{make}</option>
              )
            })}
          </Form.Control>
      </Form.Group>

      <Form.Group className="mb-3" controlId="Model">
        <Form.Label>Model</Form.Label>
        <Form.Control
          required
          value={model}
          onChange={e => setModel(e.target.value)}
          type="text"
          placeholder="(F150, Camry, RAV4, Bronco)"
          aria-describedby="basic-addon1"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="Model">
        <Form.Label>Package</Form.Label>
        <Form.Control
          required
          value={carPackage}
          onChange={e => setCarPackage(e.target.value)}
          type="text"
          placeholder="(Base, XE, XSE)"
          aria-describedby="basic-addon1"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Color</Form.Label>
        <Form.Control
          required
          value={color}
          onChange={e => setColor(e.target.value)}
          type="text"
          placeholder="Model Item"
          aria-describedby="basic-addon1"
          as="select">
            <option value="">-</option>
            {Colors && Object.values(Colors).map((color) => {
              return (
                <option value={color}>{color}</option>
              )
            })}
          </Form.Control>
      </Form.Group>

      <Form.Group className="mb-3" controlId="Model">
        <Form.Label>Year</Form.Label>
        <Form.Control
          required
          value={year}
          onChange={e => setYear(e.target.value)}
          type="number"
          placeholder="(1998, 2012, 2020)"
          aria-describedby="basic-addon1"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="Model">
        <Form.Label>Category</Form.Label>
        <Form.Control
          required
          value={category}
          onChange={e => setCategory(e.target.value)}
          type="text"
          placeholder="Model Item"
          aria-describedby="basic-addon1"
          as="select">
            <option value="">-</option>
            {Category && Object.values(Category).map((category) => {
              return (
                <option value={category}>{category}</option>
              )
            })}
        </Form.Control>
      </Form.Group>

      <Form.Group className="mb-3" controlId="Model">
        <Form.Label>Mileage</Form.Label>
        <Form.Control
          required
          value={mileage}
          onChange={e => setMileage(e.target.value)}
          type="number"
          placeholder="Miles"
          aria-describedby="basic-addon1"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="Model">
        <Form.Label>Price in Cents</Form.Label>
        <Form.Control
          required
          value={price}
          onChange={e => setPrice(e.target.value)}
          type="number"
          placeholder="($1 = 100, $100 = 10000)"
          aria-describedby="basic-addon1"
        />
      </Form.Group>

        <Button
          type="submit"
          variant="success"
          className={submitting ? 'disabled' : ''}
        >
          {submitting ? 'Adding...' : 'Add Item'}
        </Button>
    </Form>
  );
}

// 4. Single Car Row
function ItemDisplay({ item, onItemRemoval }) {
  const { Container, Row, Col, Button } = ReactBootstrap;

  const removeItem = async () => {
    await deleteFromDb(item);
    onItemRemoval(item);
  };

  return (
    <Container fluid className={`item`}>
      <Row>
        <Col xs={10} className="name mr-2">
          <span className="mr-2" style={{
            background: item.color.toLowerCase(),
            border: 'black 1px solid',
            height: 30,
            width: 30,
            display: 'inline-block'
          }}>&nbsp;</span>
          <span className="mr-2">{`$${item.price / 100}`}</span>
          
          {item.make} {item.model} {`(${item.mileage} miles)`}
        </Col>
        <Col xs={1} className="text-center remove">
          <Button
            size="sm"
            variant="link"
            onClick={removeItem}
            aria-label="Remove Item"
          >
            <i className="fa fa-trash text-danger" />
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

// 4. Functions

async function getAllCars() {
  let json;
  const res = await fetch('/cars');
  json = res ? await res.json() : [];
  return json;
}
// try catch all TODO
async function addToDb(item) {
  try {
    const res = await fetch('/cars', {
      method: 'POST',
      body: JSON.stringify({
        make: item.make,
        model: item.model,
        carPackage: item.carPackage,
        color: item.color,
        year: item.year,
        category: item.category,
        mileage: item.mileage,
        price: item.price,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    return res;
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function deleteFromDb(item) {
  await fetch(`/cars/${item.id}`, { method: 'DELETE', body: JSON.stringify({...item}) });

  return item;
}

async function getAllLogs() {
  let json;
  const res = await fetch('/logs');
  json = res ? await res.json() : [];
  return json;
}

ReactDOM.render(<App />, document.getElementById('root'));
