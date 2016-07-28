# Relevance
Filters and sorts objects by relevance based on a search string.

## Usage

Relevance is a curried function that takes three arguments.

**weightMap**: an object whose keys map to keys on the items within listOfObjects and whose values represent a multiplyer to apply to the number matches found on the listOfObjects

**listOfObjects**: an array of objects to search against

**searchString**: a string representing the search term. The string may begin with any number of 'keys:value' substrings that will match 'value' only on the `keys` property.

```
import search from 'relevance';

const weightMap = {
  title: 3,
  author: 2,
  description: 1
};

const listOfObjects = [{
    title: "The Neverending Story",
    author: "Michael Ende",
    description: "The Neverending Story is a German fantasy novel by Michael Ende that was first published in 1979. The standard English translation, by Ralph Manheim, was first published in 1983. The novel was later adapted into several films."
  }, {
    title: "The Hobbit",
    author: "J. R. R. Tolkein",
    description: "The Hobbit, or There and Back Again is a children's fantasy novel by English author J. R. R. Tolkien."
  }, {
    title: "The Horse and His Boy",
    author: "C. S. Lewis",
    description: "The Horse and His Boy is a novel for children by C. S. Lewis, published by Geoffrey Bles in 1954. It was the fifth published of seven novels in The Chronicles of Narnia and one of four that Lewis finished writing before the first book was out."
  }];

const searchString = 'description:19 title:"The Horse" several films';

search(weightMap)(listOfObjects)(searchString)



```

The example above would produce the following results.

```
[{
  title: "The Horse and His Boy",
  author: "C. S. Lewis",
  description: "The Horse and His Boy is a novel for children by C. S. Lewis, published by Geoffrey Bles in 1954. It was the fifth published of seven novels in The Chronicles of Narnia and one of four that Lewis finished writing before the first book was out."
}, {
  title: "The Neverending Story",
  author: "Michael Ende",
  description: "The Neverending Story is a German fantasy novel by Michael Ende that was first published in 1979. The standard English translation, by Ralph Manheim, was first published in 1983. The novel was later adapted into several films."
}]
```

The results each having a relevance number of 4 and 3 respective.
