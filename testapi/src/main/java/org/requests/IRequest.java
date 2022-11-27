package org.requests;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import java.io.Serializable;


public interface IRequest {

    Serializable execute(String url, String input, String output, int statusCode);
    public default boolean equalBody(String body, String output) {

        JsonElement expected = JsonParser.parseString(output).getAsJsonObject();
        JsonElement actual = JsonParser.parseString((body)).getAsJsonObject();

        if(!expected.equals(actual)){
            return false;
        }
        return true;
    }



}