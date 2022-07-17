package soselab.msdobot.aggregatebot.Entity.Vocabulary;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;

public class Concept {
    public String conceptName;
    public ArrayList<String> properties;

    public Concept(){
    }

    @Override
    public String toString(){
        return new GsonBuilder().setPrettyPrinting().create().toJson(this);
    }
}
