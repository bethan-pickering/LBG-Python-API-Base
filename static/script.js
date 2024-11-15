`use strict`

// import the dom
import * as DOM from './dom.js';

// list item function
const writeItem = item => {
  const child = document.createElement(`li`);
  child.id = item._id;
  child.innerHTML = `${JSON.stringify(item)}`;
  DOM.listOutput.appendChild(child);
}

//list item function - table version
// const writeItem = item => {
//   const tableBody = document.getElementById('listOutput');
//   const row = document.createElement('tr');

//   const id = document.createElement('td');
//   cell1.textContent = item.property1;
//   row.appendChild(id);

//   const name = document.createElement('td');
//   cell2.textContent = item.property2;
//   row.appendChild(name);

//   const description = document.createElement('td');
//   cell2.textContent = item.property2;
//   row.appendChild(description);

//   const price = document.createElement('td');
//   cell2.textContent = item.property2;
//   row.appendChild(price);

//   tableBody.appendChild(row);
// }

// //GET all function
// const get = () => {
//   DOM.listOutput.innerHTML = ``;

//   axios.get(`/read`)
//     .then((response) => {
//       if (!Array.isArray(response.data)) {
//         writeItem(response.data);
//       } else {
//         for (let item of response.data) {
//           writeItem(item);
//         }
//       }
//     }).catch((err) => {
//       console.log(err);
//     });
// }


//GET all function unformatted table version  
const createTable = (data) => {
  let table = `<table border="0"><tr>`;
  // Add table headers if the data is an array of objects 
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
    // table += Object.keys(data[0]).map(key => `<th>${key}</th>`).join('');
    // table += `</tr>`;
    // Add data rows 
    table += data.map(item => {
      return `<tr>` + Object.values(item).map(value => `<td>${value}</td>`).join('') + `</tr>`;
    }).join('');
  } else {
    // Handle case where data is a single object or primitive type 
    table += `<th>Value</th></tr><tr><td>${data}</td></tr>`;
  }
  table += `</table>`;
  return table;
};

DOM.listOutput.innerHTML = ``;
axios.get(`/read`)
  .then((response) => {
    const tableHTML = createTable(response.data);
    DOM.listOutput.innerHTML = tableHTML;
  }).catch((err) => {
    console.log(err);
  });

// POST function
const post = () => {
  axios.post(`/create`, {
    name: DOM.inputName.value,
    description: DOM.inputDescription.value,
    price: DOM.inputPrice.value
  })
    .then((response) => {
      console.log(response);
      get();
    }).catch((err) => {
      console.log(err);
    });
}

// GET one function
const getOne = () => {
  axios.get(`/read/${DOM.inputID.value}`)
    .then((response) => {
      DOM.singleOutput.innerHTML = JSON.stringify(response.data);
    }).catch((err) => {
      console.log(err);
    });
}

// PUT function
const put = () => {
  axios.put(`/update/${DOM.inputUpdateID.value}`, {
    name: DOM.inputUpdateName.value,
    description: DOM.inputUpdateDescription.value,
    price: DOM.inputUpdatePrice.value
  })
    .then((response) => {
      console.log(response);
      get();
    }).catch((err) => {
      console.log(err);
    });
}

// DELETE function
const del = () => {
  axios.delete(`/delete/${DOM.inputDeleteID.value}`)
    .then((response) => {
      console.log(response);
      get();
    }).catch((err) => {
      console.log(err);
    });
}

// set up the buttons' on click events
DOM.buttonCreate.onclick = () => post();
DOM.buttonReadOne.onclick = () => getOne();
DOM.buttonUpdate.onclick = () => put();
DOM.buttonDelete.onclick = () => del();

// run the get function on page load
get();