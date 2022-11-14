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
    <Container>
      <p>Logs</p>
      {logs && logs.map((log) => {
        return (
          <p>{`${log.action} ${log.make} ${log.model}`}</p>
        )
      })}
    </Container>
    </Container>
  );
}

// 3. Add car form
function AddItemForm({ onNewItem }) {
  const { Form, Button } = ReactBootstrap;
  const [make, setMake] = React.useState('Ford');
  const [model, setModel] = React.useState('F150');
  const [carPackage, setCarPackage] = React.useState('Base');
  const [color, setColor] = React.useState('Beige');
  const [year, setYear] = React.useState(2021);
  const [category, setCategory] = React.useState('Pickup Truck');
  const [mileage, setMileage] = React.useState(10000);
  const [price, setPrice] = React.useState(2000000);
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
          value={make}
          onChange={e => setMake(e.target.value)}
          type="text"
          placeholder="Model Item"
          aria-describedby="basic-addon1"
          as="select">
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
          value={color}
          onChange={e => setColor(e.target.value)}
          type="text"
          placeholder="Model Item"
          aria-describedby="basic-addon1"
          as="select">
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
          value={category}
          onChange={e => setCategory(e.target.value)}
          type="text"
          placeholder="Model Item"
          aria-describedby="basic-addon1"
          as="select">
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
          // disabled={!newItem.length}
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
        <Col xs={10} className="name">
          {item.make} {item.model}
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
