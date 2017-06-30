# get average rating by category
```
db.getCollection('authors').aggregate({$group: {_id: '$title', averageAge: {$avg : '$ukrRating'}}})
```

// середній вік